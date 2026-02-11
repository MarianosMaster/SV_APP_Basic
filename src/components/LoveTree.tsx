import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface LoveTreeProps {
    startDate: string;
}

export const LoveTree: React.FC<LoveTreeProps> = ({ startDate }) => {
    // Manual date calculation to be absolutely safe
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const weeksTogether = Math.floor(diffDays / 7);

    // Ensure enough hearts for a lush tree, but not too many
    const heartCount = Math.max(weeksTogether, 40);

    const hearts = useMemo(() => {
        return Array.from({ length: heartCount }).map((_, i) => {
            // Create a "cloud" of hearts above the trunk
            // Center (50, 40), Radius approx 35
            const angle = Math.random() * Math.PI * 2;
            const r = Math.sqrt(Math.random()) * 30 * (Math.random() > 0.8 ? 1.2 : 1); // Random spikes in cloud

            // Flatten the circle slightly to make it wider
            const x = 50 + r * Math.cos(angle) * 1.3;
            const y = 40 + r * Math.sin(angle) * 0.9; // Slightly shorter Y

            return {
                id: i,
                x,
                y,
                scale: 0.6 + Math.random() * 0.6,
                rotate: Math.random() * 60 - 30,
                color: ['#e11d48', '#f43f5e', '#ec4899', '#db2777'][Math.floor(Math.random() * 4)],
                delay: Math.random() * 1.5
            };
        });
    }, [heartCount]);

    return (
        <div className="w-full h-64 flex justify-center items-end my-4 relative z-10 pointer-events-none">
            <svg className="h-full w-full max-w-[300px] overflow-visible drop-shadow-lg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMax meet">
                {/* Trunk */}
                <motion.path
                    d="M50,100 C60,80 45,60 50,40"
                    stroke="#795548"
                    strokeWidth="5"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5 }}
                />
                <motion.path
                    d="M50,70 Q75,60 85,45"
                    stroke="#795548"
                    strokeWidth="3.5"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 0.2 }}
                />
                <motion.path
                    d="M50,60 Q25,50 15,40"
                    stroke="#795548"
                    strokeWidth="3.5"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 0.4 }}
                />

                {/* Hearts Grouped */}
                {hearts.map((heart) => (
                    <g key={heart.id} transform={`translate(${heart.x}, ${heart.y}) rotate(${heart.rotate})`}>
                        <motion.path
                            d="M0,2.8 C-0.2,2.8 -3,0 -3,-1.5 C-3,-3 -1.5,-4 0,-2 C1.5,-4 3,-3 3,-1.5 C3,0 0.2,2.8 0,2.8" // More defined heart shape ending at tip
                            fill={heart.color}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: heart.scale, opacity: 0.95 }}
                            transition={{
                                delay: 1.2 + heart.delay,
                                duration: 0.6,
                                type: 'spring',
                                stiffness: 200
                            }}
                        />
                    </g>
                ))}
            </svg>
        </div>
    );
};
