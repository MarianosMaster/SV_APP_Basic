import React from 'react';
import { motion } from 'framer-motion';

export const Logo: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`relative flex items-center justify-center ${className}`}>
        <motion.svg
            width="50"
            height="50"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            {/* Soft background glow */}
            <circle cx="50" cy="50" r="45" fill="url(#grad1)" fillOpacity="0.1" />

            {/* Heart 1: Rose Gold */}
            <motion.path
                d="M30 35 C30 25, 45 25, 50 35 C55 25, 70 25, 70 35 C70 50, 50 65, 50 65 C50 65, 30 50, 30 35 Z"
                stroke="#e11d48"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
            />

            {/* Heart 2: Intertwined, larger */}
            <motion.path
                d="M20 45 C20 30, 45 30, 50 45 C55 30, 80 30, 80 45 C80 65, 50 85, 50 85 C50 85, 20 65, 20 45 Z"
                stroke="#fda4af"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-70"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
            />

            <defs>
                <radialGradient id="grad1" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(50 50) rotate(90) scale(45)">
                    <stop stopColor="#fb7185" />
                    <stop offset="1" stopColor="#fb7185" stopOpacity="0" />
                </radialGradient>
            </defs>
        </motion.svg>
    </div>
);
