import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchHistoricalData } from '../services/apiService';
import { HistoricalDataPoint, MetalDefinition } from '../types';

interface ChartComponentProps {
    metal: MetalDefinition;
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-700/80 backdrop-blur-sm p-3 rounded-lg border border-slate-600 shadow-lg">
                <p className="label text-slate-300">{`${label}`}</p>
                <p className="intro text-cyan-400 font-bold">{`قیمت: ${payload[0].value?.toLocaleString('fa-IR')}`}</p>
            </div>
        );
    }
    return null;
};

export const ChartComponent: React.FC<ChartComponentProps> = ({ metal }) => {
    const [data, setData] = useState<HistoricalDataPoint[]>([]);
    const [range, setRange] = useState('1m');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const result = await fetchHistoricalData(metal.key, range);
            setData(result);
            setLoading(false);
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [metal, range]);

    const ranges = [
        { key: '1m', label: '۱ ماه' },
        { key: '6m', label: '۶ ماه' },
        { key: '1y', label: '۱ سال' },
    ];

    return (
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg w-full max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-700 rounded-full">
                        <metal.icon className="w-8 h-8 text-cyan-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">{`نمودار قیمت ${metal.name}`}</h2>
                </div>
                <div className="flex items-center bg-slate-700 rounded-lg p-1">
                    {ranges.map(r => (
                        <button
                            key={r.key}
                            onClick={() => setRange(r.key)}
                            className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${
                                range === r.key ? 'bg-cyan-500 text-slate-900' : 'text-slate-600 hover:bg-slate-600'
                            }`}
                        >
                            {r.label}
                        </button>
                    ))}
                </div>
            </div>
            {loading ? (
                 <div className="flex justify-center items-center h-80">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400"></div>
                 </div>
            ) : (
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                            <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis
                                stroke="#94a3b8"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => new Intl.NumberFormat('fa-IR', { notation: "compact" }).format(value)}
                                domain={['dataMin', 'dataMax']}
                                mirror={true}
                             />
                            <Tooltip content={<CustomTooltip />} />
                            <Line type="monotone" dataKey="price" stroke="#22d3ee" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};
