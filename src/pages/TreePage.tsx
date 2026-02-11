import React from 'react';
import { useRelationship } from '../context/RelationshipContext';
import { TimeTogether } from '../components/TimeTogether';
import { LoveTree } from '../components/LoveTree';
import { motion } from 'framer-motion';

export const TreePage: React.FC = () => {
    const { startDate } = useRelationship();

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <header className="pt-8 px-4 text-center z-10">
                <h1 className="text-3xl font-script text-rose-700">Nuestro Jardín</h1>
                <p className="text-xs text-rose-400 uppercase tracking-widest mt-1">Creciendo juntos</p>
            </header>

            <div className="flex-1 relative flex flex-col justify-end pb-32">
                <LoveTree startDate={startDate} />
            </div>

            <motion.div
                className="px-4 mb-24 z-10"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <TimeTogether startDate={startDate} />
            </motion.div>
        </div>
    );
};
