import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock } from 'lucide-react';
import { isBefore, startOfDay, differenceInDays } from 'date-fns';
import type { Idea } from '../types';

interface ExperienceProgressProps {
    experience: Idea;
}

export const ExperienceProgress: React.FC<ExperienceProgressProps> = ({ experience }) => {
    const [progress, setProgress] = useState(0);
    const [daysLeft, setDaysLeft] = useState<number | null>(null);

    useEffect(() => {
        if (!experience.date) return;

        const calculateProgress = () => {
            const targetDate = startOfDay(new Date(experience.date!));
            const startDate = startOfDay(new Date(experience.createdAt));
            const now = startOfDay(new Date());
            
            if (isBefore(targetDate, now)) {
                setDaysLeft(0);
                setProgress(100);
                return;
            }
            
            const totalDays = differenceInDays(targetDate, startDate);
            const elapsedDays = differenceInDays(now, startDate);
            
            const currentDaysLeft = differenceInDays(targetDate, now);
            setDaysLeft(currentDaysLeft);
            
            // Si totalDays es 0 (se creó el mismo día), mostrar 100%
            const percentage = totalDays <= 0 ? 100 : Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100));
            setProgress(percentage);
        };

        calculateProgress();
        const timer = setInterval(calculateProgress, 1000 * 60 * 60); 
        return () => clearInterval(timer);
    }, [experience]);

    if (!experience.date || (daysLeft !== null && daysLeft <= 0)) return null; // No mostrar si no hay fecha o ya pasó

    return (
        <div className="mx-4 mb-4 bg-white/60 p-4 rounded-2xl border border-rose-100 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-center mb-2 relative z-10">
                <h3 className="text-sm font-bold text-rose-800 flex items-center gap-2 truncate">
                    <MapPin size={14} className="text-rose-500 shrink-0" />
                    <span className="truncate">{experience.title}</span>
                </h3>
                <span className="text-[10px] font-bold text-rose-500 bg-rose-100 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                    <Clock size={10} /> {daysLeft === null ? '...' : daysLeft} d
                </span>
            </div>
            
            <div className="w-full h-2 bg-rose-100 rounded-full overflow-hidden relative z-10">
                <motion.div 
                    className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />
            </div>
        </div>
    );
};
