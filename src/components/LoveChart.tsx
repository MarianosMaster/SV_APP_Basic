import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

export const LoveChart: React.FC = () => {
    return (
        <motion.div
            className="glass-card p-4 mx-4 mt-2 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="flex items-center justify-center gap-2 mb-3 text-rose-800">
                <TrendingUp size={16} />
                <h3 className="font-bold text-xs uppercase tracking-widest">Nivel de Amor</h3>
            </div>

            <div className="relative h-24 w-full flex items-end px-2 gap-1">
                {/* Simple Bar Chart */}
                {[30, 45, 60, 50, 75, 85, 90, 100].map((height, i) => (
                    <motion.div
                        key={i}
                        className="flex-1 rounded-t-sm"
                        style={{
                            background: `linear-gradient(to top, #fda4af, #f43f5e)`,
                            opacity: 0.8
                        }}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: i * 0.1, duration: 0.8, ease: "backOut" }}
                    />
                ))}
            </div>
            <p className="text-center text-[10px] text-rose-400 mt-2 font-medium italic">
                Resultados en tiempo real... ¡y subiendo!
            </p>
        </motion.div>
    );
};
