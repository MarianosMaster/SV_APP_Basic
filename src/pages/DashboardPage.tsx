import React, { useMemo, useState } from 'react';
import { useRelationship } from '../context/RelationshipContext';
import { DaveCounter } from '../components/DaveCounter';
import { LoveChart } from '../components/LoveChart';
import { AnniversaryCountdown } from '../components/AnniversaryCountdown';
import { MagicBall } from '../components/MagicBall';
import { motion } from 'framer-motion';
import { Bell, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

export const Dashboard: React.FC = () => {
    const { daveDate, startDate } = useRelationship();
    const [showLove, setShowLove] = useState(false);

    // Dynamic Daily Message Logic
    const dailyMessage = useMemo(() => {
        const day = new Date().getDay(); // 0 = Sunday, 1 = Monday, ...
        const isWeekend = day === 0 || day === 6;

        const weekdayMessages = [
            "Te quiero 💛", "Te amo 😘", "Te necesito 😭", "Te deseo 🫠",
            "Tú puedes 💪", "Mucho ánimo 😘", "Eres mi princesa 👑", "Te echo de menos 😭"
        ];

        const weekendMessages = [
            "Nos vemos en nada ⏰", "Ya no queda nadaaa 💃"
        ];

        const list = isWeekend ? weekendMessages : weekdayMessages;
        const seed = new Date().toDateString();
        let hash = 0;
        for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
        const index = Math.abs(hash) % list.length;

        return list[index];
    }, []);

    const handleSendLove = () => {
        setShowLove(true);
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.9 },
            colors: ['#e11d48', '#fb7185', '#fda4af']
        });
        setTimeout(() => setShowLove(false), 2000);
    };

    return (
        <div className="flex flex-col gap-4 pb-24 max-w-md mx-auto overflow-x-hidden">
            <header className="pt-8 pb-2 px-4">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-center"
                >
                    <h1 className="text-5xl font-script text-rose-600 mb-1">Hola, Pilar</h1>
                    <p className="text-rose-400 font-medium tracking-wide text-sm">Bienvenida a nuestro mundo</p>
                </motion.div>
            </header>

            {/* New Anniversary Countdown */}
            <AnniversaryCountdown startDate={startDate} />

            <DaveCounter daveDate={daveDate} />
            <LoveChart />

            {/* Magic 8-Ball Feature */}
            <MagicBall />

            <motion.div
                className="mx-4 mt-2 p-4 bg-white/50 rounded-2xl border border-rose-100 text-center relative overflow-hidden"
                whileTap={{ scale: 0.98 }}
            >
                <div className="absolute top-0 right-0 w-12 h-12 bg-yellow-100 rounded-full blur-xl opacity-50 -mr-6 -mt-6"></div>
                <p className="font-bold text-rose-800 text-sm mb-1 flex items-center justify-center gap-2 relative z-10">
                    <Bell size={14} className="text-rose-500 animate-bounce" />
                    Notificación Diaria
                </p>
                <p className="text-xl font-script text-rose-600 animate-pulse relative z-10">"{dailyMessage}"</p>
            </motion.div>

            {/* Extra: Interactive Send Love Button */}
            <div className="flex justify-center mt-4 mb-8">
                <motion.button
                    className="group relative flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-3 rounded-full shadow-lg shadow-rose-200 font-bold uppercase tracking-wider text-xs overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendLove}
                >
                    <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 skew-x-12 -translate-x-full" />
                    <Heart size={16} className={`fill-white ${showLove ? 'animate-ping' : ''}`} />
                    <span>Enviar Amor</span>
                </motion.button>
            </div>
        </div>
    );
};
