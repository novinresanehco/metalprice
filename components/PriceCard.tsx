import React from 'react';
import { MetalPrice } from '../types';

interface PriceCardProps {
    metal: MetalPrice;
    onClick: () => void;
}

const PriceCard: React.FC<PriceCardProps> = ({ metal, onClick }) => {
    const isPositive = metal.change >= 0;
    const changeColor = isPositive ? 'text-green-400' : 'text-red-400';
    const changeIcon = isPositive ? '▲' : '▼';

    const previousPrice = metal.price / (1 + metal.change / 100);
    const absoluteChange = metal.price - previousPrice;

    return (
        <div 
            className="bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-cyan-500/20 hover:scale-[1.02] transition-all duration-300 cursor-pointer flex flex-col justify-between"
            onClick={onClick}
        >
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-700 rounded-full">
                            <metal.icon className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-100">{metal.name}</h3>
                            <p className="text-xs text-slate-400">{metal.source}</p>
                        </div>
                    </div>
                </div>
                <div className="text-left">
                    <p className="text-3xl font-bold tracking-tight text-white mb-1">{metal.price.toLocaleString('fa-IR')}</p>
                    <p className="text-sm text-slate-400">{metal.unit}</p>
                </div>
            </div>
             <div className={`mt-4 flex items-baseline justify-end gap-2 ${changeColor}`}>
                <span className="font-semibold text-base">
                   {absoluteChange !== 0 && `${isPositive ? '+' : ''}${Math.round(absoluteChange).toLocaleString('fa-IR')}`}
                </span>
                <span className="font-bold text-lg">
                   ({changeIcon} {Math.abs(metal.change).toFixed(2)}%)
                </span>
            </div>
        </div>
    );
};

export default PriceCard;