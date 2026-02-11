import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useRelationship } from '../context/RelationshipContext';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, Trash2, Heart, Navigation } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';

// Custom Heart Marker
const createCustomIcon = () => {
    const iconHtml = renderToStaticMarkup(
        <div className="relative flex items-center justify-center w-10 h-10 group">
            <div className="absolute inset-0 bg-rose-500 rounded-full opacity-20 animate-ping group-hover:opacity-40" />
            <div className="relative z-10 text-rose-600 drop-shadow-md transform transition-transform group-hover:scale-110">
                <Heart fill="#e11d48" size={32} />
            </div>
            <div className="absolute -bottom-1 w-2 h-1 bg-black/20 rounded-full blur-[1px]" />
        </div>
    );

    return L.divIcon({
        html: iconHtml,
        className: 'custom-leaflet-icon',
        iconSize: [40, 40],
        iconAnchor: [20, 38], // Pointer at bottom center
        popupAnchor: [0, -30]
    });
};

const customIcon = createCustomIcon();

// Component to handle map flying
const MapFlyTo: React.FC<{ center: [number, number] | null }> = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, 13, { duration: 2 });
        }
    }, [center, map]);
    return null;
};

export const MapPage: React.FC = () => {
    const { places, addPlace, removePlace } = useRelationship();
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.length > 2) {
                setIsSearching(true);
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
                    const data = await response.json();
                    setSearchResults(data);
                    setShowResults(true);
                } catch (error) {
                    console.error("Search failed", error);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
                setShowResults(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSelectPlace = (place: any) => {
        const lat = parseFloat(place.lat);
        const lng = parseFloat(place.lon);

        // Add place immediately
        addPlace({
            name: place.display_name.split(',')[0], // Take first part of name
            lat: lat,
            lng: lng,
            dateVisited: new Date().toISOString(),
            description: place.display_name
        });

        // Fly to location
        setMapCenter([lat, lng]);

        // Reset search
        setSearchQuery('');
        setShowResults(false);
    };

    return (
        <div className="h-full w-full relative flex flex-col">
            <header className="px-4 pt-4 pb-2 z-10">
                <h1 className="text-3xl font-script text-rose-600 mb-2">Nuestro Mundo 🌍</h1>

                {/* Search Bar */}
                <div className="relative">
                    <div className="flex items-center bg-white rounded-xl shadow-md border border-rose-100 px-3 py-2">
                        <Search size={18} className="text-rose-400 mr-2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Busca un lugar especial..."
                            className="flex-1 bg-transparent outline-none text-rose-900 placeholder-rose-300 text-sm"
                        />
                        {isSearching && <div className="animate-spin h-4 w-4 border-2 border-rose-400 border-t-transparent rounded-full" />}
                    </div>

                    {/* Search Results Dropdown */}
                    <AnimatePresence>
                        {showResults && searchResults.length > 0 && (
                            <motion.ul
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-rose-100 max-h-60 overflow-y-auto z-50 divide-y divide-rose-50"
                            >
                                {searchResults.map((result: any) => (
                                    <li key={result.place_id}>
                                        <button
                                            onClick={() => handleSelectPlace(result)}
                                            className="w-full text-left px-4 py-3 hover:bg-rose-50 transition-colors flex items-start gap-2"
                                        >
                                            <MapPin size={16} className="text-rose-400 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <span className="block font-medium text-rose-900 text-sm">{result.display_name.split(',')[0]}</span>
                                                <span className="block text-xs text-rose-400 truncate">{result.display_name}</span>
                                            </div>
                                        </button>
                                    </li>
                                ))}
                            </motion.ul>
                        )}
                    </AnimatePresence>
                </div>
            </header>

            <div className="flex-1 rounded-2xl overflow-hidden border-2 border-rose-200 shadow-inner relative z-0 mx-4 mb-4">
                <MapContainer
                    center={[40.4168, -3.7038]} // Center of Spain
                    zoom={6}
                    scrollWheelZoom={true}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <MapFlyTo center={mapCenter} />

                    {places.map((place) => (
                        <Marker key={place.id} position={[place.lat, place.lng]} icon={customIcon}>
                            <Popup>
                                <div className="text-center p-1 min-w-[150px]">
                                    <h3 className="font-bold text-rose-600 font-script text-lg mb-1">{place.name}</h3>
                                    <p className="text-[10px] text-gray-400 mb-2">{new Date(place.dateVisited!).toLocaleDateString()}</p>
                                    <button
                                        onClick={() => removePlace(place.id)}
                                        className="w-full flex items-center justify-center gap-1 bg-red-50 text-red-500 hover:bg-red-100 py-1.5 rounded-lg transition-colors text-xs font-bold"
                                    >
                                        <Trash2 size={12} />
                                        Eliminar
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>

                {/* Instructions Overlay */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur px-3 py-2 rounded-lg shadow-lg text-xs text-center text-rose-600 z-[1000] pointer-events-none flex items-center justify-center gap-2">
                    <Navigation size={12} />
                    Usa el buscador para añadir nuevos destinos
                </div>
            </div>
        </div>
    );
};
