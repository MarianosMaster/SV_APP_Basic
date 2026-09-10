import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { isBefore, addMonths, setDate, startOfDay, differenceInDays } from 'date-fns';

interface MensiversaryProgressProps {
    startDate: string;
}

export const MensiversaryProgress: React.FC<MensiversaryProgressProps> = ({ startDate }) => {
    const [progress, setProgress] = useState(0);
    const [daysLeft, setDaysLeft] = useState(0);

    useEffect(() => {
        const calculateProgress = () => {
            const start = new Date(startDate);
            const startDay = start.getDate(); // 24
            
            const now = new Date();
            
            // Determinar el próximo mensiversario
            let nextMensiversary = setDate(now, startDay);
            
            // Si el mensiversario de este mes ya ha pasado hoy, el próximo es el mes que viene
            if (isBefore(startOfDay(nextMensiversary), startOfDay(now))) {
                nextMensiversary = addMonths(nextMensiversary, 1);
            }
            
            // El último mensiversario fue hace un mes desde el próximo
            const lastMensiversary = addMonths(nextMensiversary, -1);
            
            const totalDays = differenceInDays(startOfDay(nextMensiversary), startOfDay(lastMensiversary));
            const elapsedDays = differenceInDays(startOfDay(now), startOfDay(lastMensiversary));
            
            const currentDaysLeft = differenceInDays(startOfDay(nextMensiversary), startOfDay(now));
            setDaysLeft(currentDaysLeft);
            
            // Calculate percentage
            const percentage = Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100));
            setProgress(percentage);
        };

        calculateProgress();
        // Update everyday at midnight (or simple interval)
        const timer = setInterval(calculateProgress, 1000 * 60 * 60); 
        return () => clearInterval(timer);
    }, [startDate]);

    return (
        <div className="mx-4 mb-6 bg-white/60 p-4 rounded-2xl border border-rose-100 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-center mb-2 relative z-10">
                <h3 className="text-sm font-bold text-rose-800 flex items-center gap-2">
                    <Heart size={14} className="text-rose-500" fill={daysLeft === 0 ? "currentColor" : "none"} />
                    {daysLeft === 0 ? "¡Feliz Mensiversario!" : "Próximo Mensiversario"}
                </h3>
                <span className="text-xs font-bold text-rose-500 bg-rose-100 px-2 py-0.5 rounded-full">
                    {daysLeft === 0 ? "¡Hoy!" : `${daysLeft} días`}
                </span>
            </div>
            
            <div className="w-full h-3 bg-rose-100 rounded-full overflow-hidden relative z-10">
                <motion.div 
                    className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />
            </div>
            
            {daysLeft === 0 && (
                <div className="absolute inset-0 bg-pink-100/30 animate-pulse pointer-events-none" />
            )}
        </div>
    );
};
