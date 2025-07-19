import React, { useState, useCallback } from 'react';
import { generateAnalysis } from '../services/geminiService';
import { MetalPrice, Analysis } from '../types';
import { GoldIcon } from './icons/MetalIcons';

interface AnalysisSectionProps {
    prices: MetalPrice[];
}

export const AnalysisSection: React.FC<AnalysisSectionProps> = ({ prices }) => {
    const [analysis, setAnalysis] = useState<Analysis | null>(null);
    const [loading, setLoading] = useState(false);
    const [hasGenerated, setHasGenerated] = useState(false);

    const handleGenerateAnalysis = useCallback(async () => {
        if (prices.length === 0) return;
        setLoading(true);
        setAnalysis(null);
        setHasGenerated(true);
        const result = await generateAnalysis(prices);
        setAnalysis(result);
        setLoading(false);
    }, [prices]);

    return (
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg w-full max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-3 sm:mb-0">تحلیل روزانه بازار با هوش مصنوعی</h2>
                <button
                    onClick={handleGenerateAnalysis}
                    disabled={loading || !prices.length}
                    className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-2 px-5 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>در حال پردازش...</span>
                        </>
                    ) : (
                        <>
                            <GoldIcon className="w-5 h-5" />
                            <span>تولید تحلیل جدید</span>
                        </>
                    )}
                </button>
            </div>

            {loading && (
                 <div className="text-center py-10 px-6 bg-slate-900/50 rounded-lg">
                     <div className="flex justify-center items-center mb-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
                     </div>
                    <p className="text-slate-400">
                       هوش مصنوعی در حال تحلیل بازار است. لطفاً کمی صبر کنید...
                    </p>
                </div>
            )}
            
            {analysis && !loading && (
                <div className="bg-slate-900/50 p-6 rounded-lg animate-fade-in">
                    <h3 className="text-xl font-bold text-cyan-400 mb-3">{analysis.title}</h3>
                    <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{analysis.content}</p>
                </div>
            )}
            
            {!loading && !hasGenerated && (
                <div className="text-center py-10 px-6 bg-slate-900/50 rounded-lg">
                    <p className="text-slate-400">
                       برای دریافت آخرین تحلیل بازار فلزات، روی دکمه "تولید تحلیل جدید" کلیک کنید.
                    </p>
                </div>
            )}
        </div>
    );
};