import React, { useEffect, useState } from 'react';
import { differenceInDays, differenceInMonths, differenceInYears } from 'date-fns';
import { motion } from 'framer-motion';

export const DaveCounter: React.FC<{ daveDate: string }> = ({ daveDate }) => {
    const [time, setTime] = useState({ years: 0, months: 0, days: 0 });

    useEffect(() => {
        const calculateTime = () => {
            const start = new Date(daveDate);
            const now = new Date();

            const years = differenceInYears(now, start);
            const months = differenceInMonths(now, start) % 12;
            const days = differenceInDays(now, start) % 30; // Approx

            setTime({ years, months, days });
        };

        calculateTime();
        const timer = setInterval(calculateTime, 1000 * 60 * 60);
        return () => clearInterval(timer);
    }, [daveDate]);

    return (
        <motion.div
            className="glass-card p-6 flex flex-col items-center text-center space-y-4 relative overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300"></div>

            <div className="relative w-28 h-28 mt-2">
                <img
                    src="https://media.giphy.com/media/11sBLVxNs7v6WA/giphy.gif"
                    alt="Dave Minion"
                    className="w-full h-full object-cover rounded-full border-4 border-yellow-400 shadow-md"
                />
                <div className="absolute -bottom-2 -right-1 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-bounce">
                    ¡Dave!
                </div>
            </div>

            <div>
                <h3 className="text-lg font-bold text-rose-800 uppercase tracking-widest text-[10px]">Tiempo con Dave</h3>
                <div className="flex gap-3 justify-center mt-2 text-rose-600 items-baseline">
                    <div className="flex flex-col">
                        <span className="text-3xl font-black font-script">{time.years}</span>
                        <span className="text-[9px] uppercase tracking-wider font-bold text-rose-400">Años</span>
                    </div>
                    <span className="text-xl font-light text-rose-300">/</span>
                    <div className="flex flex-col">
                        <span className="text-3xl font-black font-script">{time.months}</span>
                        <span className="text-[9px] uppercase tracking-wider font-bold text-rose-400">Meses</span>
                    </div>
                    <span className="text-xl font-light text-rose-300">/</span>
                    <div className="flex flex-col">
                        <span className="text-3xl font-black font-script">{time.days}</span>
                        <span className="text-[9px] uppercase tracking-wider font-bold text-rose-400">Días</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
