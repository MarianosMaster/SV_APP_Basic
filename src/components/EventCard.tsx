import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Music } from 'lucide-react';

interface EventCardProps {
    title: string;
    date: string; // YYYY-MM-DD
    location: string;
    imageUrl: string;
}

export const EventCard: React.FC<EventCardProps> = ({ title, date, location, imageUrl }) => {
    // We check if today is rigorously past the event date
    const eventDate = new Date(date + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (today > eventDate) {
        return null;
    }

    const formattedDate = new Intl.DateTimeFormat('es-ES', {
        day: 'numeric',
        month: 'long'
    }).format(eventDate);

    return (
        <motion.div
            className="mx-4 mt-2 bg-white/60 backdrop-blur-md rounded-2xl border border-rose-100 overflow-hidden shadow-sm flex"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="w-1/3 min-w-[100px] h-24 relative overflow-hidden">
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/60"></div>
            </div>
            <div className="p-3 flex flex-col justify-center flex-1">
                <h3 className="font-bold text-rose-800 text-sm leading-tight flex items-center gap-1.5">
                    <Music size={14} className="text-rose-500 shrink-0" />
                    <span className="line-clamp-1">{title}</span>
                </h3>
                <div className="mt-1 space-y-0.5">
                    <p className="text-xs text-rose-600 flex items-center gap-1.5">
                        <Calendar size={12} className="opacity-70 shrink-0" />
                        <span className="capitalize">{formattedDate}</span>
                    </p>
                    <p className="text-xs text-rose-600 flex items-center gap-1.5">
                        <MapPin size={12} className="opacity-70 shrink-0" />
                        {location}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};
