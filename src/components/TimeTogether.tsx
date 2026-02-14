import React, { useEffect, useState } from 'react';
import { differenceInDays, differenceInMonths, differenceInYears, addYears, addMonths } from 'date-fns';

export const TimeTogether: React.FC<{ startDate: string }> = ({ startDate }) => {
    const [time, setTime] = useState({ years: 0, months: 0, days: 0 });

    useEffect(() => {
        const calculateTime = () => {
            const start = new Date(startDate);
            const now = new Date();

            const years = differenceInYears(now, start);
            const dateAfterYears = addYears(start, years);

            const months = differenceInMonths(now, dateAfterYears);
            const dateAfterMonths = addMonths(dateAfterYears, months);

            const days = differenceInDays(now, dateAfterMonths);

            setTime({ years, months, days });
        };

        calculateTime();
        const timer = setInterval(calculateTime, 1000 * 60 * 60);
        return () => clearInterval(timer);
    }, [startDate]);

    return (
        <div className="text-center p-6 glass-card mx-4 mt-[-20px] relative z-20">
            <h2 className="text-rose-800 font-bold mb-4 uppercase tracking-widest text-xs">Nuestra Historia</h2>
            <div className="grid grid-cols-3 gap-4 divide-x divide-rose-100">
                <div className="flex flex-col items-center">
                    <span className="text-4xl font-black text-rose-500 font-script">{time.years}</span>
                    <span className="text-[10px] font-bold text-rose-300 uppercase mt-1">Años</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-4xl font-black text-rose-500 font-script">{time.months}</span>
                    <span className="text-[10px] font-bold text-rose-300 uppercase mt-1">Meses</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-4xl font-black text-rose-500 font-script">{time.days}</span>
                    <span className="text-[10px] font-bold text-rose-300 uppercase mt-1">Días</span>
                </div>
            </div>
        </div>
    );
};
