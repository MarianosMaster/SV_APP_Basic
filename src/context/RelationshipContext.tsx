import React, { createContext, useContext, useEffect, useState } from 'react';
import type { RelationshipState, Idea, Place } from '../types';

interface RelationshipContextType extends RelationshipState {
    updateStartDate: (date: Date) => void;
    updateDaveDate: (date: Date) => void;
    addIdea: (idea: Omit<Idea, 'id' | 'createdAt'>) => void;
    removeIdea: (id: string) => void;
    updateIdea: (id: string, updates: Partial<Omit<Idea, 'id' | 'createdAt'>>) => void;
    addPlace: (place: Omit<Place, 'id'>) => void;
    removePlace: (id: string) => void;
}

const RelationshipContext = createContext<RelationshipContextType | undefined>(undefined);

const STORAGE_KEY = 'our-love-story-data';

const DEFAULT_STATE: RelationshipState = {
    startDate: new Date('2024-06-24').toISOString(),
    daveDate: new Date('2024-06-08').toISOString(),
    ideas: [],
    places: [
        { id: '1', name: 'Cáceres', lat: 39.4753, lng: -6.3723, dateVisited: '2024-01-01' },
        { id: '2', name: 'Ribadesella', lat: 43.4623, lng: -5.0607, dateVisited: '2024-01-01' },
        { id: '3', name: 'Barcelona', lat: 41.3851, lng: 2.1734, dateVisited: '2024-01-01' },
        { id: '4', name: 'Córdoba', lat: 37.8882, lng: -4.7794, dateVisited: '2024-01-01' },
        { id: '5', name: 'Madrid', lat: 40.4168, lng: -3.7038, dateVisited: '2024-01-01' }
    ]
};

export const RelationshipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<RelationshipState>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        // Migration for existing data to include places if missing
        const parsed = saved ? JSON.parse(saved) : DEFAULT_STATE;
        if (!parsed.places) parsed.places = DEFAULT_STATE.places;
        return parsed;
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [state]);

    const updateStartDate = (date: Date) => {
        setState(prev => ({ ...prev, startDate: date.toISOString() }));
    };

    const updateDaveDate = (date: Date) => {
        setState(prev => ({ ...prev, daveDate: date.toISOString() }));
    };

    const addIdea = (idea: Omit<Idea, 'id' | 'createdAt'>) => {
        const newIdea: Idea = {
            ...idea,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString()
        };
        setState(prev => ({ ...prev, ideas: [newIdea, ...prev.ideas] }));
    };

    const removeIdea = (id: string) => {
        setState(prev => ({ ...prev, ideas: prev.ideas.filter(i => i.id !== id) }));
    };

    const updateIdea = (id: string, updates: Partial<Omit<Idea, 'id' | 'createdAt'>>) => {
        setState(prev => ({
            ...prev,
            ideas: prev.ideas.map(idea =>
                idea.id === id ? { ...idea, ...updates } : idea
            )
        }));
    };

    const addPlace = (place: Omit<Place, 'id'>) => {
        const newPlace: Place = {
            ...place,
            id: crypto.randomUUID()
        };
        setState(prev => ({ ...prev, places: [...prev.places, newPlace] }));
    };

    const removePlace = (id: string) => {
        setState(prev => ({ ...prev, places: prev.places.filter(p => p.id !== id) }));
    };

    return (
        <RelationshipContext.Provider value={{ ...state, updateStartDate, updateDaveDate, addIdea, removeIdea, updateIdea, addPlace, removePlace }}>
            {children}
        </RelationshipContext.Provider>
    );
};

export const useRelationship = () => {
    const context = useContext(RelationshipContext);
    if (context === undefined) {
        throw new Error('useRelationship must be used within a RelationshipProvider');
    }
    return context;
};
