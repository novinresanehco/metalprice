
import { GoogleGenAI, Type } from "@google/genai";
import { MetalPrice, Analysis } from '../types';

if (!process.env.API_KEY) {
    // In a real app, you'd want to handle this more gracefully.
    // For this example, we will proceed, and the UI will show an error if the key is missing.
    console.warn("API_KEY environment variable not set for Gemini API.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateAnalysis = async (prices: MetalPrice[]): Promise<Analysis> => {
    if (!process.env.API_KEY) {
        return {
            title: "خطا در اتصال",
            content: "کلید API برای سرویس Gemini تنظیم نشده است. لطفاً از طریق متغیرهای محیطی آن را تنظیم کنید."
        };
    }
    
    const priceDataString = prices.map(p => `${p.name} (${p.source}): ${p.price.toLocaleString('fa-IR')} ${p.unit}`).join('\n');

    const prompt = `
        You are an expert financial analyst specializing in the global and Iranian metals market.
        Your task is to provide a concise, insightful daily market analysis based on the data provided.
        The analysis must be in Persian.

        Here is the latest price data:
        ${priceDataString}

        Please generate a market analysis in the following JSON format. Do not include any other text or markdown formatting like \`\`\`json.
        Your entire response must be only the JSON object.

        The JSON object should conform to this schema:
        {
          "title": "A short, catchy, and summary title for today's analysis in Persian.",
          "content": "A comprehensive analysis paragraph in Persian. It should connect global and domestic prices, explain recent fluctuations, and provide a short-term outlook. The analysis should be clear and useful for an Iranian investor."
        }
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        content: { type: Type.STRING }
                    },
                    required: ["title", "content"]
                },
            }
        });
        
        const jsonText = response.text.trim();
        const analysisResult: Analysis = JSON.parse(jsonText);
        return analysisResult;

    } catch (error) {
        console.error("Gemini API error:", error);
        let errorMessage = "یک خطای ناشناخته در هنگام تولید تحلیل رخ داد.";
        if (error instanceof Error) {
            errorMessage = `خطا در ارتباط با Gemini: ${error.message}`;
        }
        return {
            title: "خطا در تولید تحلیل",
            content: errorMessage,
        };
    }
};
