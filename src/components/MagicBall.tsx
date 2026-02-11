import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const ANSWERS = [
    "¡Por supuesto, guapa! ❤️",
    "Mmm... pregúntame luego 🤔",
    "¡SÍ, SÍ, SÍ! 🎉",
    "Pídeselo con un beso 💋",
    "Mis fuentes dicen que sí ✨",
    "Duda de todo, menos de mi amor 🌹",
    "¡Claro que sí, mi vida! 😍",
    "Mejor no te digo ahora... 🤫",
    "Cuenta con ello 💪",
    "Solo si me das un abrazo 🤗"
];

export const MagicBall: React.FC = () => {
    const [answer, setAnswer] = useState<string | null>(null);
    const [isShaking, setIsShaking] = useState(false);

    const askBall = () => {
        if (isShaking) return;

        setIsShaking(true);
        setAnswer(null);

        // Shake for 1 second, then reveal answer
        setTimeout(() => {
            const randomAnswer = ANSWERS[Math.floor(Math.random() * ANSWERS.length)];
            setAnswer(randomAnswer);
            setIsShaking(false);
        }, 1000);
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-white/50 rounded-3xl border border-rose-100 shadow-sm mx-4 mt-6">
            <h3 className="text-rose-800 font-bold mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-yellow-500" />
                Bola Mágica del Amor
            </h3>

            <p className="text-xs text-rose-400 mb-6 text-center">
                Piensa una pregunta de Sí/No y toca la bola...
            </p>

            <motion.button
                onClick={askBall}
                animate={isShaking ? {
                    x: [-5, 5, -5, 5, 0],
                    rotate: [-5, 5, -5, 5, 0],
                } : {}}
                transition={{ duration: 0.5, repeat: isShaking ? Infinity : 0 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-48 h-48 rounded-full bg-gradient-to-br from-rose-500 to-purple-600 shadow-xl shadow-rose-200 flex items-center justify-center overflow-hidden border-4 border-white/20"
            >
                {/* Shine effect */}
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-full pointer-events-none" />

                <div className="relative z-10 w-24 h-24 bg-white rounded-full flex items-center justify-center p-2 text-center shadow-inner">
                    <AnimatePresence mode="wait">
                        {answer ? (
                            <motion.p
                                key="answer"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-xs font-bold text-rose-600 leading-tight"
                            >
                                {answer}
                            </motion.p>
                        ) : (
                            <motion.div
                                key="8"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-5xl font-script text-rose-200"
                            >
                                8
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.button>
        </div>
    );
};
