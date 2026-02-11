import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Home, Gift, Globe } from 'lucide-react';

export const Layout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const tabs = [
        { path: '/', icon: Home, label: 'Inicio' },
        { path: '/tree', icon: Heart, label: 'Jardín' },
        { path: '/map', icon: Globe, label: 'Mundo' },
        { path: '/ideas', icon: Gift, label: 'Deseos' },
    ];

    const currentTabIndex = tabs.findIndex(tab => tab.path === location.pathname);
    const isMapPage = location.pathname === '/map';

    const handleSwipe = (direction: number) => {
        const newIndex = currentTabIndex + direction;
        if (newIndex >= 0 && newIndex < tabs.length) {
            navigate(tabs[newIndex].path);
        }
    };

    return (
        <div className="flex flex-col h-screen w-full bg-rose-50 overflow-hidden">
            {/* Main Content Area with Swipe */}
            <motion.div
                className="flex-1 overflow-hidden relative"
                drag={isMapPage ? false : "x"}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                    if (!isMapPage) {
                        if (info.offset.x > 100) handleSwipe(-1);
                        else if (info.offset.x < -100) handleSwipe(1);
                    }
                }}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="h-full w-full overflow-y-auto pb-20 p-4"
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </motion.div>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-rose-100 pb-safe">
                <div className="flex justify-around items-center h-16">
                    {tabs.map((tab) => {
                        const isActive = location.pathname === tab.path;
                        const Icon = tab.icon;

                        return (
                            <button
                                key={tab.path}
                                onClick={() => navigate(tab.path)}
                                className={`flex flex-col items-center justify-center w-full h-full transition-colors ${isActive ? 'text-rose-600' : 'text-rose-300 hover:text-rose-500'
                                    }`}
                            >
                                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                <span className="text-xs mt-1 font-medium">{tab.label}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="tab-indicator"
                                        className="absolute bottom-1 w-1 h-1 bg-rose-600 rounded-full"
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
};
