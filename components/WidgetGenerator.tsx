
import React, { useState, useMemo } from 'react';
import { METAL_DEFINITIONS } from '../constants';

const WidgetGenerator: React.FC = () => {
    const [selectedMetals, setSelectedMetals] = useState<string[]>(['COPPER_WIRE', 'GOLD_GLOBAL']);
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const [copied, setCopied] = useState(false);

    const handleMetalToggle = (key: string) => {
        setSelectedMetals(prev =>
            prev.includes(key) ? prev.filter(m => m !== key) : [...prev, key]
        );
    };

    const generatedCode = useMemo(() => {
        const metalsString = selectedMetals.join(',');
        return `<!-- کد ویجت قیمت‌های فلزات - شروع -->
<div class="metal-price-widget" data-metals="${metalsString}" data-theme="${theme}"></div>
<script src="https://your-domain.com/widget.js" async defer></script>
<!-- کد ویجت قیمت‌های فلزات - پایان -->`;
    }, [selectedMetals, theme]);

    const handleCopy = () => {
        if (selectedMetals.length === 0) {
            alert('لطفاً حداقل یک فلز را برای ویجت انتخاب کنید.');
            return;
        }
        navigator.clipboard.writeText(generatedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg w-full max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">ویجت ساز قیمت فلزات</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Options Panel */}
                <div>
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-slate-300 mb-3">۱. فلزات مورد نظر را انتخاب کنید:</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {METAL_DEFINITIONS.map(metal => (
                                <label key={metal.key} className="flex items-center gap-2 p-2 bg-slate-700 rounded-md cursor-pointer hover:bg-slate-600 transition">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox h-4 w-4 rounded bg-slate-800 border-slate-500 text-cyan-500 focus:ring-cyan-500"
                                        checked={selectedMetals.includes(metal.key)}
                                        onChange={() => handleMetalToggle(metal.key)}
                                    />
                                    <span className="text-sm text-slate-200">{metal.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-slate-300 mb-3">۲. پوسته را انتخاب کنید:</h3>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="theme" value="dark" checked={theme === 'dark'} onChange={() => setTheme('dark')} className="form-radio text-cyan-500 bg-slate-800"/>
                                <span className="text-slate-200">پوسته تیره</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="theme" value="light" checked={theme === 'light'} onChange={() => setTheme('light')} className="form-radio text-cyan-500 bg-slate-800"/>
                                <span className="text-slate-200">پوسته روشن</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Code Panel */}
                <div>
                    <h3 className="text-lg font-semibold text-slate-300 mb-3">۳. کد را کپی و استفاده کنید:</h3>
                    <div className="relative">
                        <pre className="bg-slate-900 text-sm text-yellow-300 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
                            <code>{generatedCode}</code>
                        </pre>
                        <button 
                            onClick={handleCopy}
                            className="absolute top-2 left-2 bg-slate-700 hover:bg-cyan-500 text-slate-200 hover:text-slate-900 font-bold py-1 px-3 rounded-md transition-colors"
                        >
                            {copied ? 'کپی شد!' : 'کپی'}
                        </button>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                        این کد را در هر قسمتی از HTML سایت خود قرار دهید تا ویجت نمایش داده شود.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WidgetGenerator;
