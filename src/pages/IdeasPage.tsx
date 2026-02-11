import React, { useState } from 'react';
import { useRelationship } from '../context/RelationshipContext';
import type { Priority, Season } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ExternalLink, MapPin, Gift, Plus, X, Tag, Calendar, Image as ImageIcon, Edit2, Film, User } from 'lucide-react';

export const IdeasPage: React.FC = () => {
    const { ideas, addIdea, removeIdea, updateIdea } = useRelationship();
    const [activeTab, setActiveTab] = useState<'EXPERIENCE' | 'GIFT' | 'MOVIE'>('EXPERIENCE');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form State
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState<Priority>('Medium');
    const [image, setImage] = useState('');
    const [season, setSeason] = useState<Season>('Any');
    const [link, setLink] = useState('');
    const [suggestedBy, setSuggestedBy] = useState<'Manolo' | 'Pilar' | 'Ambos'>('Ambos');

    const activeIdeas = ideas.filter(i => i.type === activeTab);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const ideaData = {
            type: activeTab,
            title,
            priority,
            image: image || undefined,
            season: activeTab === 'EXPERIENCE' ? season : undefined,
            link: activeTab === 'GIFT' ? link : undefined,
            suggestedBy: activeTab === 'MOVIE' ? suggestedBy : undefined,
        };

        if (editingId) {
            updateIdea(editingId, ideaData);
        } else {
            addIdea(ideaData);
        }

        setShowForm(false);
        resetForm();
    };

    const resetForm = () => {
        setTitle('');
        setPriority('Medium');
        setImage('');
        setSeason('Any');
        setLink('');
        setSuggestedBy('Ambos');
        setEditingId(null);
    };

    const priorityLabel = { Low: 'Baja', Medium: 'Media', High: 'Alta' };
    const seasonLabel = { Any: 'Cualquiera', Spring: 'Primavera', Summer: 'Verano', Autumn: 'Otoño', Winter: 'Invierno' };

    return (
        <div className="flex flex-col h-full bg-gradient-to-b from-rose-50 to-white">
            {/* Header Tabs */}
            <div className="px-4 pt-6 pb-2">
                <h1 className="text-3xl font-script text-rose-600 mb-4 px-2">Lista de Deseos</h1>
                <div className="flex p-1 bg-rose-100/50 rounded-xl space-x-1">
                    <button
                        onClick={() => setActiveTab('EXPERIENCE')}
                        className={`flex-1 py-2 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wide transition-all ${activeTab === 'EXPERIENCE' ? 'bg-white text-rose-600 shadow-sm' : 'text-rose-400'}`}
                    >
                        Experiencias
                    </button>
                    <button
                        onClick={() => setActiveTab('GIFT')}
                        className={`flex-1 py-2 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wide transition-all ${activeTab === 'GIFT' ? 'bg-white text-rose-600 shadow-sm' : 'text-rose-400'}`}
                    >
                        Regalos
                    </button>
                    <button
                        onClick={() => setActiveTab('MOVIE')}
                        className={`flex-1 py-2 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wide transition-all ${activeTab === 'MOVIE' ? 'bg-white text-rose-600 shadow-sm' : 'text-rose-400'}`}
                    >
                        Películas
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-4 pb-24 space-y-3 pt-2">
                <AnimatePresence mode="popLayout">
                    {activeIdeas.map(idea => (
                        <motion.div
                            key={idea.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-xl p-3 shadow-sm border border-rose-50 flex gap-3 items-center"
                        >
                            <div className="w-12 h-12 rounded-lg bg-rose-50 flex-shrink-0 overflow-hidden flex items-center justify-center">
                                {idea.image ? (
                                    <img src={idea.image} className="w-full h-full object-cover" alt="" />
                                ) : (
                                    activeTab === 'EXPERIENCE' ? <MapPin className="text-rose-300" size={20} /> :
                                        activeTab === 'GIFT' ? <Gift className="text-rose-300" size={20} /> :
                                            <Film className="text-rose-300" size={20} />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start gap-2">
                                    <h3 className="font-bold text-rose-900 text-sm truncate">{idea.title}</h3>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => {
                                                setTitle(idea.title);
                                                setPriority(idea.priority);
                                                setImage(idea.image || '');
                                                setSeason(idea.season || 'Any');
                                                setLink(idea.link || '');
                                                setSuggestedBy(idea.suggestedBy || 'Ambos');
                                                setEditingId(idea.id);
                                                setShowForm(true);
                                            }}
                                            className="text-rose-300 hover:text-rose-500 p-1"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button onClick={() => removeIdea(idea.id)} className="text-rose-300 hover:text-rose-500 p-1"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                                <div className="flex gap-1 mt-1 flex-wrap">
                                    <span className="text-[10px] bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded font-medium">{priorityLabel[idea.priority]}</span>
                                    {idea.season && <span className="text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded font-medium">{seasonLabel[idea.season]}</span>}
                                    {idea.link && <a href={idea.link} target="_blank" className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-medium flex items-center gap-1">Link <ExternalLink size={8} /></a>}
                                    {idea.suggestedBy && <span className="text-[10px] bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded font-medium flex items-center gap-1"> <User size={8} /> {idea.suggestedBy}</span>}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {activeIdeas.length === 0 && (
                    <div className="text-center py-10 opacity-50">
                        <p className="font-script text-xl text-rose-400">¡Añade algo bonito!</p>
                    </div>
                )}
            </div>

            {/* FAB */}
            <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                    resetForm();
                    setShowForm(true);
                }}
                className="absolute bottom-20 right-5 w-12 h-12 bg-rose-500 rounded-full text-white shadow-lg shadow-rose-200 flex items-center justify-center z-30"
            >
                <Plus size={24} />
            </motion.button>

            {/* Form Modal (Styled) */}
            <AnimatePresence>
                {showForm && (
                    <motion.div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/20 backdrop-blur-[2px] p-0 sm:p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowForm(false)}>
                        <motion.div
                            className="bg-white w-full max-w-sm rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl"
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-script text-2xl text-rose-600">{editingId ? 'Editar Deseo' : 'Nuevo Deseo'}</h2>
                                <button onClick={() => setShowForm(false)} className="bg-rose-50 p-1 rounded-full text-rose-400"><X size={18} /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-3">
                                <div className="bg-rose-50/50 rounded-xl px-3 py-2 border border-rose-100 focus-within:border-rose-400 transition-colors">
                                    <label className="text-[10px] uppercase font-bold text-rose-400 flex items-center gap-1"><Tag size={10} /> Nombre</label>
                                    <input className="w-full bg-transparent outline-none text-rose-900 font-medium" value={title} onChange={e => setTitle(e.target.value)} required placeholder="..." />
                                </div>

                                <div className="flex gap-3">
                                    <div className="flex-1 bg-rose-50/50 rounded-xl px-3 py-2 border border-rose-100">
                                        <label className="text-[10px] uppercase font-bold text-rose-400">Prioridad</label>
                                        <select className="w-full bg-transparent outline-none text-rose-900 text-sm" value={priority} onChange={e => setPriority(e.target.value as Priority)}>
                                            <option value="Low">Baja</option>
                                            <option value="Medium">Media</option>
                                            <option value="High">Alta</option>
                                        </select>
                                    </div>
                                    {activeTab === 'EXPERIENCE' && (
                                        <div className="flex-1 bg-rose-50/50 rounded-xl px-3 py-2 border border-rose-100">
                                            <label className="text-[10px] uppercase font-bold text-rose-400 flex items-center gap-1"><Calendar size={10} /> Estación</label>
                                            <select className="w-full bg-transparent outline-none text-rose-900 text-sm" value={season} onChange={e => setSeason(e.target.value as Season)}>
                                                <option value="Any">Cualquiera</option>
                                                <option value="Spring">Primavera</option>
                                                <option value="Summer">Verano</option>
                                                <option value="Autumn">Otoño</option>
                                                <option value="Winter">Invierno</option>
                                            </select>
                                        </div>
                                    )}
                                    {activeTab === 'MOVIE' && (
                                        <div className="flex-1 bg-rose-50/50 rounded-xl px-3 py-2 border border-rose-100">
                                            <label className="text-[10px] uppercase font-bold text-rose-400 flex items-center gap-1"><User size={10} /> Sugerido por</label>
                                            <select className="w-full bg-transparent outline-none text-rose-900 text-sm" value={suggestedBy} onChange={e => setSuggestedBy(e.target.value as any)}>
                                                <option value="Ambos">Ambos</option>
                                                <option value="Manolo">Manolo</option>
                                                <option value="Pilar">Pilar</option>
                                            </select>
                                        </div>
                                    )}
                                </div>

                                {activeTab === 'GIFT' && (
                                    <div className="bg-rose-50/50 rounded-xl px-3 py-2 border border-rose-100">
                                        <label className="text-[10px] uppercase font-bold text-rose-400 flex items-center gap-1"><ExternalLink size={10} /> Enlace de Compra (URL)</label>
                                        <input type="url" className="w-full bg-transparent outline-none text-rose-900 text-xs truncate"
                                            value={link}
                                            onChange={e => setLink(e.target.value)}
                                            placeholder="https://tienda.com/producto..."
                                        />
                                    </div>
                                )}

                                <div className="bg-rose-50/50 rounded-xl px-3 py-2 border border-rose-100">
                                    <label className="text-[10px] uppercase font-bold text-rose-400 flex items-center gap-1"><ImageIcon size={10} /> {activeTab === 'GIFT' ? 'Imagen del Producto (URL)' : activeTab === 'MOVIE' ? 'Portada/Poster (URL)' : 'Foto Lugar (URL)'}</label>
                                    <input type="url" className="w-full bg-transparent outline-none text-rose-900 text-xs truncate"
                                        value={image}
                                        onChange={e => setImage(e.target.value)}
                                        placeholder="https://..."
                                    />
                                </div>

                                <button className="w-full bg-rose-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-rose-200 active:scale-95 transition-transform">
                                    {editingId ? 'Guardar Cambios' : '¡Añadir!'}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
