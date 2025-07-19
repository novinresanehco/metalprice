import React, { useState, useEffect, useCallback } from 'react';
import { MetalPrice, View, MetalDefinition } from './types';
import { METAL_DEFINITIONS } from './constants';
import { fetchGeneralPrices, fetchImePrice } from './services/apiService';
import PriceCard from './components/PriceCard';
import { ChartComponent } from './components/ChartComponent';
import { AnalysisSection } from './components/AnalysisSection';
import WidgetGenerator from './components/WidgetGenerator';

const App: React.FC = () => {
    const [prices, setPrices] = useState<MetalPrice[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [activeView, setActiveView] = useState<View>('dashboard');
    const [selectedMetal, setSelectedMetal] = useState<MetalDefinition | null>(null);

    // Callback to update the prices state in a robust way
    const updatePricesState = useCallback((newPrices: (MetalPrice | MetalPrice[])) => {
        const pricesToUpdate = Array.isArray(newPrices) ? newPrices : [newPrices];
        
        setPrices(currentPrices => {
            const priceMap = new Map(currentPrices.map(p => [p.key, p]));
            pricesToUpdate.forEach(np => priceMap.set(np.key, np));
            
            // Ensure the order remains consistent with METAL_DEFINITIONS
            const orderedPrices: MetalPrice[] = [];
            METAL_DEFINITIONS.forEach(def => {
                if (priceMap.has(def.key)) {
                    orderedPrices.push(priceMap.get(def.key)!);
                }
            });
            return orderedPrices;
        });
    }, []);

    // Effect for initial data load
    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            const [generalPrices, imePrice] = await Promise.all([
                fetchGeneralPrices(),
                fetchImePrice()
            ]);
            updatePricesState([...generalPrices, imePrice]);
            setLoading(false);
        };
        fetchInitialData();
    }, [updatePricesState]);
    
    // Effect for polling general prices every 10 minutes
    useEffect(() => {
        const intervalId = setInterval(async () => {
            const generalPrices = await fetchGeneralPrices();
            updatePricesState(generalPrices);
        }, 10 * 60 * 1000); // 10 minutes

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [updatePricesState]);

    // Effect for scheduling the daily IME fetch at 17:00 Tehran time
    useEffect(() => {
        let timeoutId: number;

        const scheduleImeFetch = async () => {
            const now = new Date();
            // Get current time in Tehran (UTC+3:30)
            const tehranNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tehran' }));

            const nextFetchTime = new Date(tehranNow);
            nextFetchTime.setHours(17, 0, 0, 0);

            if (tehranNow.getTime() > nextFetchTime.getTime()) {
                // If it's past 5 PM in Tehran, schedule for tomorrow
                nextFetchTime.setDate(nextFetchTime.getDate() + 1);
            }

            const delay = nextFetchTime.getTime() - tehranNow.getTime();
            
            console.log(`Next IME fetch scheduled in ${Math.round(delay / 1000 / 60)} minutes.`);

            timeoutId = window.setTimeout(async () => {
                const imePrice = await fetchImePrice();
                updatePricesState(imePrice);
                // After the first scheduled fetch, set a 24-hour interval
                scheduleImeFetch(); 
            }, delay);
        };

        scheduleImeFetch();

        return () => clearTimeout(timeoutId); // Cleanup on unmount
    }, [updatePricesState]);


    const handleCardClick = (metalKey: string) => {
        const metal = METAL_DEFINITIONS.find(m => m.key === metalKey);
        if (metal) {
            setSelectedMetal(metal);
        }
    };

    const renderView = () => {
        if (selectedMetal) {
             return (
                <div className="mt-8 animate-fade-in">
                     <button 
                        onClick={() => setSelectedMetal(null)}
                        className="mb-6 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                     >
                        <span>بازگشت به داشبورد</span>
                        <span className="transform -scale-x-100">→</span>
                     </button>
                    <ChartComponent metal={selectedMetal} />
                </div>
            );
        }

        switch (activeView) {
            case 'analysis':
                return <div className="animate-fade-in"><AnalysisSection prices={prices} /></div>;
            case 'widget':
                return <div className="animate-fade-in"><WidgetGenerator /></div>;
            case 'dashboard':
            default:
                return (
                    loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="bg-slate-800 rounded-xl p-6 shadow-lg h-48 animate-pulse">
                                  <div className="h-6 bg-slate-700 rounded w-3/4 mb-4"></div>
                                  <div className="h-10 bg-slate-700 rounded w-1/2 mb-2"></div>
                                  <div className="h-4 bg-slate-700 rounded w-1/3"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                            {prices.map(metal => (
                                <PriceCard key={metal.key} metal={metal} onClick={() => handleCardClick(metal.key)} />
                            ))}
                        </div>
                    )
                );
        }
    };

    const NavButton = ({ view, label }: { view: View; label: string }) => (
        <button
            onClick={() => {
                setActiveView(view);
                setSelectedMetal(null);
            }}
            className={`px-4 py-2 text-sm sm:text-base font-semibold rounded-md transition-colors duration-300 ${
                activeView === view && !selectedMetal ? 'bg-cyan-500 text-slate-900' : 'text-slate-300 hover:bg-slate-700'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 p-4 sm:p-8">
            <header className="flex flex-col sm:flex-row justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-4 sm:mb-0">داشبورد قیمت فلزات</h1>
                <nav className="flex items-center bg-slate-800 rounded-lg p-1 space-x-1 space-x-reverse">
                    <NavButton view="dashboard" label="داشبورد" />
                    <NavButton view="analysis" label="تحلیل روزانه" />
                    <NavButton view="widget" label="ویجت ساز" />
                </nav>
            </header>

            <main>
                {renderView()}
            </main>
            
            <footer className="text-center mt-12 text-slate-500 text-sm">
                <p>پیاده‌سازی شده با React و Gemini API. طراحی شده برای نمایش قابلیت‌های یک سیستم مدرن.</p>
            </footer>
        </div>
    );
};

export default App;
