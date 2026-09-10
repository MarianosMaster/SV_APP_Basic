import React, { useMemo, useState } from 'react';
import { useRelationship } from '../context/RelationshipContext';
import { DaveCounter } from '../components/DaveCounter';
import { LoveChart } from '../components/LoveChart';
import { AnniversaryCountdown } from '../components/AnniversaryCountdown';
import { EventCard } from '../components/EventCard';
import { MagicBall } from '../components/MagicBall';
import { TimeTogether } from '../components/TimeTogether';
import { MensiversaryProgress } from '../components/MensiversaryProgress';
import { ExperienceProgress } from '../components/ExperienceProgress';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

export const Dashboard: React.FC = () => {
    const { daveDate, startDate, ideas } = useRelationship();
    const [showLove, setShowLove] = useState(false);

    // Dynamic Daily Reason Logic
    const dailyReason = useMemo(() => {
        const reasons = [
            "Por cómo sonríes cuando te quedas dormida.",
            "Porque siempre sabes cómo hacerme reír.",
            "Por tus abrazos que me reinician la vida.",
            "Porque eres mi lugar seguro en el mundo.",
            "Por tu forma de ver la vida con tanta luz.",
            "Porque haces que los días grises tengan color.",
            "Por la manera en la que me miras.",
            "Porque contigo todo es más fácil.",
            "Por tu inteligencia y tu fuerza.",
            "Porque me haces querer ser mejor persona cada día."
        ];

        const seed = new Date().toDateString();
        let hash = 0;
        for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
        const index = Math.abs(hash) % reasons.length;

        return reasons[index];
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

            {/* Contador de Tiempo Juntos */}
            <TimeTogether startDate={startDate} />

            {/* New Anniversary Countdown */}
            <AnniversaryCountdown startDate={startDate} />
            
            {/* Mensiversary Progress */}
            <MensiversaryProgress startDate={startDate} />

            {/* Experiencias Planeadas */}
            {ideas.filter(idea => idea.type === 'EXPERIENCE' && idea.date).map(idea => (
                <ExperienceProgress key={idea.id} experience={idea} />
            ))}

            {/* Concert Events */}
            <EventCard
                title="Fito & Fitipaldis"
                date="2026-04-10"
                location="Cáceres"
                imageUrl="https://rocksesion.com/wp-content/uploads/2025/11/fito-fitipaldis-el-monte-de-los-aullidos-rocksesion.jpg?w=640"
            />
            <EventCard
                title="Celtas Cortos"
                date="2026-04-17"
                location="Valladolid"
                imageUrl="https://d2cyzdatssrhg7.cloudfront.net/export/sites/default/ets/.content/products/img/00-00089Hc.jpg?__locale=es"
            />

            <DaveCounter daveDate={daveDate} />
            <LoveChart />

            {/* Magic 8-Ball Feature */}
            <MagicBall />

            <motion.div
                className="mx-4 mt-2 mb-4 p-5 bg-white/50 rounded-2xl border border-pink-100 text-center relative overflow-hidden shadow-sm"
                whileTap={{ scale: 0.98 }}
            >
                <div className="absolute top-0 right-0 w-16 h-16 bg-pink-200 rounded-full blur-2xl opacity-50 -mr-8 -mt-8"></div>
                <p className="font-bold text-pink-800 mb-2 flex items-center justify-center gap-2 relative z-10 uppercase tracking-widest text-[10px]">
                    <Heart size={14} className="text-pink-500 fill-pink-500 animate-pulse" />
                    Razón diaria para quererte
                </p>
                <p className="text-xl font-script text-pink-600 relative z-10 leading-tight">"{dailyReason}"</p>
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
