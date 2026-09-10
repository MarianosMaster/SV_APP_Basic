import React, { useState, useEffect } from 'react';
import { useRelationship } from '../context/RelationshipContext';
import { TimeTogether } from '../components/TimeTogether';
import { LoveTree } from '../components/LoveTree';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets } from 'lucide-react';

export const TreePage: React.FC = () => {
    const { startDate } = useRelationship();
    const [isWatered, setIsWatered] = useState(false);
    const [showMessage, setShowMessage] = useState(false);

    useEffect(() => {
        const lastWatered = localStorage.getItem('lastWateredDate');
        const today = new Date().toDateString();
        if (lastWatered === today) {
            setIsWatered(true);
        }
    }, []);

    const handleWater = () => {
        if (isWatered) return;
        
        const today = new Date().toDateString();
        localStorage.setItem('lastWateredDate', today);
        setIsWatered(true);
        setShowMessage(true);
        
        setTimeout(() => {
            setShowMessage(false);
        }, 4000);
    };

    return (
        <div className="flex flex-col h-full overflow-hidden relative">
            <header className="pt-8 px-4 text-center z-10">
                <h1 className="text-3xl font-script text-rose-700">Nuestro Jardín</h1>
                <p className="text-xs text-rose-400 uppercase tracking-widest mt-1">Creciendo juntos</p>
            </header>

            <div className="flex-1 relative flex flex-col justify-end pb-32">
                <LoveTree startDate={startDate} isWatered={isWatered} />
                
                {/* Botón de Regar */}
                <div className="absolute bottom-10 left-0 right-0 flex justify-center z-20">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9, rotate: -20 }}
                        onClick={handleWater}
                        disabled={isWatered}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold shadow-lg shadow-blue-200 transition-colors ${
                            isWatered ? 'bg-blue-100 text-blue-300' : 'bg-gradient-to-r from-blue-400 to-cyan-400 text-white'
                        }`}
                    >
                        <Droplets size={20} className={isWatered ? '' : 'animate-pulse'} />
                        {isWatered ? '¡Regado hoy!' : 'Regar Jardín'}
                    </motion.button>
                </div>
            </div>

            <AnimatePresence>
                {showMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute top-1/4 left-4 right-4 bg-white/90 backdrop-blur p-4 rounded-2xl shadow-xl text-center z-50 border border-pink-100"
                    >
                        <p className="font-script text-2xl text-pink-600 mb-1">¡Gracias por regarme!</p>
                        <p className="text-sm font-medium text-pink-400">Nuestro amor sigue floreciendo un día más.</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                className="px-4 mb-24 z-10"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <TimeTogether startDate={startDate} />
            </motion.div>
        </div>
    );
};
