import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { isPast, addYears, setYear, format } from 'date-fns';
import { Sparkles, CalendarHeart } from 'lucide-react';

interface AnniversaryCountdownProps {
    startDate: string;
}

export const AnniversaryCountdown: React.FC<AnniversaryCountdownProps> = ({ startDate }) => {
    const [timeLeft, setTimeLeft] = useState<{ days: number, hours: number, minutes: number }>({ days: 0, hours: 0, minutes: 0 });
    const [nextDate, setNextDate] = useState<Date>(new Date());
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const calculateTime = () => {
            const start = new Date(startDate);
            const now = new Date();
            const currentYear = now.getFullYear();

            let next = setYear(start, currentYear);
            if (isPast(next)) {
                next = addYears(next, 1);
            }

            setNextDate(next);

            const totalDiff = next.getTime() - now.getTime();
            const days = Math.floor(totalDiff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((totalDiff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((totalDiff / 1000 / 60) % 60);

            setTimeLeft({ days, hours, minutes });

            // Calculate progress percentage (assuming a year-long cycle)
            const lastAnniversary = addYears(next, -1);
            const totalYearMillis = next.getTime() - lastAnniversary.getTime();
            const elapsed = now.getTime() - lastAnniversary.getTime();
            setProgress(Math.min(100, Math.max(0, (elapsed / totalYearMillis) * 100)));
        };

        calculateTime();
        const timer = setInterval(calculateTime, 60000); // Update every minute

        return () => clearInterval(timer);
    }, [startDate]);

    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative mb-6 mx-4"
        >
            <div className="glass-card p-5 relative overflow-hidden bg-gradient-to-br from-white/80 to-rose-50/80 border-rose-100">

                {/* Background Decorative Elements */}
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-rose-200/20 rounded-full blur-xl animate-pulse" />
                <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-16 h-16 bg-pink-200/20 rounded-full blur-xl animate-pulse" />

                <div className="flex items-center justify-between relative z-10">
                    {/* Circular Progress */}
                    <div className="relative w-24 h-24 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="48"
                                cy="48"
                                r="40"
                                stroke="currentColor"
                                strokeWidth="6"
                                fill="transparent"
                                className="text-rose-100"
                            />
                            <motion.circle
                                cx="48"
                                cy="48"
                                r="40"
                                stroke="currentColor"
                                strokeWidth="6"
                                fill="transparent"
                                className="text-rose-500"
                                strokeDasharray={251.2}
                                strokeDashoffset={251.2 - (251.2 * progress) / 100}
                                initial={{ strokeDashoffset: 251.2 }}
                                animate={{ strokeDashoffset: 251.2 - (251.2 * progress) / 100 }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-rose-600">
                            <span className="text-2xl font-bold leading-none">{timeLeft.days}</span>
                            <span className="text-[10px] uppercase font-bold tracking-wider">Días</span>
                        </div>
                    </div>

                    {/* Info Text */}
                    <div className="flex-1 pl-5 text-right">
                        <div className="flex items-center justify-end gap-1 text-rose-400 mb-1">
                            <Sparkles size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Próximo Hito</span>
                        </div>
                        <h3 className="text-xl font-script text-rose-800 mb-1">Nuestro Aniversario</h3>
                        <div className="inline-flex items-center gap-2 bg-rose-100/50 px-3 py-1 rounded-full">
                            <CalendarHeart size={12} className="text-rose-500" />
                            <span className="text-xs font-bold text-rose-600">
                                {format(nextDate, 'dd/MM/yyyy')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Dynamic Progress Message */}
                <div className="mt-4 pt-3 border-t border-rose-100/50 text-center">
                    <p className="text-xs text-rose-400 font-medium italic">
                        {progress < 25 && "¡Acabamos de empezar otra vuelta al sol! 🚀"}
                        {progress >= 25 && progress < 50 && "¡Un cuarto del camino recorrido! 🍂"}
                        {progress >= 50 && progress < 75 && "¡Ya queda menos de la mitad! ❤️"}
                        {progress >= 75 && progress < 90 && "¡La recta final! 😍"}
                        {progress >= 90 && "¡Casi está aquí! 🎉"}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};
