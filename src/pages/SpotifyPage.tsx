import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Music, ExternalLink, Settings, Check } from 'lucide-react';

export const SpotifyPage: React.FC = () => {
    const [playlistLink, setPlaylistLink] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    
    useEffect(() => {
        const savedLink = localStorage.getItem('spotify-playlist-link');
        if (savedLink) {
            setPlaylistLink(savedLink);
        } else {
            // Default placeholder playlist (can be changed by user)
            setIsEditing(true);
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('spotify-playlist-link', playlistLink);
        setIsEditing(false);
    };

    // Extract Playlist ID from Link to use in embed
    // Example link: https://open.spotify.com/playlist/37i9dQZF1DX50QitC6Oqtw?si=...
    const getEmbedUrl = (link: string) => {
        if (!link) return '';
        try {
            const url = new URL(link);
            const pathSegments = url.pathname.split('/');
            const idIndex = pathSegments.indexOf('playlist') + 1;
            if (idIndex > 0 && idIndex < pathSegments.length) {
                const id = pathSegments[idIndex];
                return `https://open.spotify.com/embed/playlist/${id}?utm_source=generator`;
            }
        } catch (e) {
            return '';
        }
        return '';
    };

    const embedUrl = getEmbedUrl(playlistLink);

    return (
        <div className="flex flex-col h-full bg-gradient-to-b from-green-50 to-white">
            <div className="px-4 pt-6 pb-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-script text-green-700 px-2 flex items-center gap-2">
                        <Music className="text-green-500" /> Nuestra Música
                    </h1>
                    {!isEditing && (
                        <button onClick={() => setIsEditing(true)} className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors">
                            <Settings size={18} />
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 px-4 pb-24 overflow-y-auto">
                {isEditing ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-5 rounded-2xl shadow-sm border border-green-100"
                    >
                        <h2 className="font-bold text-green-800 mb-2">Configura vuestra Playlist</h2>
                        <p className="text-xs text-green-600 mb-4">Pega aquí el enlace de la lista de Spotify que compartís. Asegúrate de que es una lista colaborativa si queréis añadir canciones los dos.</p>
                        
                        <div className="flex flex-col gap-3">
                            <input 
                                type="url" 
                                placeholder="https://open.spotify.com/playlist/..."
                                value={playlistLink}
                                onChange={(e) => setPlaylistLink(e.target.value)}
                                className="w-full bg-green-50 px-4 py-3 rounded-xl outline-none text-sm border border-transparent focus:border-green-300 transition-colors text-green-900"
                            />
                            <button 
                                onClick={handleSave}
                                disabled={!playlistLink.includes('spotify.com/playlist')}
                                className="flex items-center justify-center gap-2 bg-green-500 text-white font-bold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all"
                            >
                                <Check size={18} /> Guardar Playlist
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col gap-4 h-full"
                    >
                        {embedUrl ? (
                            <div className="bg-white rounded-3xl shadow-lg border border-green-100 overflow-hidden h-[400px]">
                                <iframe 
                                    src={embedUrl} 
                                    width="100%" 
                                    height="100%" 
                                    frameBorder="0" 
                                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                                    loading="lazy"
                                    className="rounded-3xl"
                                ></iframe>
                            </div>
                        ) : (
                            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm text-center">
                                No se pudo cargar la playlist. Verifica que el enlace es correcto.
                            </div>
                        )}

                        <div className="mt-4">
                            <a 
                                href={playlistLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 bg-[#1DB954] text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-200 active:scale-95 transition-transform"
                            >
                                <ExternalLink size={20} />
                                Abrir en Spotify para añadir canciones
                            </a>
                            <p className="text-center text-xs text-green-600 mt-3 px-4">
                                Usa el botón de arriba para abrir la app de Spotify y añadir nuevas canciones a vuestra lista.
                            </p>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};
