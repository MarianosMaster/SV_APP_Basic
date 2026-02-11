import React, { createContext, useContext, useEffect, useState } from 'react';
import type { RelationshipState, Idea } from '../types';

interface RelationshipContextType extends RelationshipState {
    updateStartDate: (date: Date) => void;
    updateDaveDate: (date: Date) => void;
    addIdea: (idea: Omit<Idea, 'id' | 'createdAt'>) => void;
    removeIdea: (id: string) => void;
    updateIdea: (id: string, updates: Partial<Omit<Idea, 'id' | 'createdAt'>>) => void;
}

const RelationshipContext = createContext<RelationshipContextType | undefined>(undefined);

const STORAGE_KEY = 'our-love-story-data';

const DEFAULT_STATE: RelationshipState = {
    startDate: new Date('2024-06-24').toISOString(),
    daveDate: new Date('2024-06-08').toISOString(),
    ideas: []
};

export const RelationshipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<RelationshipState>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : DEFAULT_STATE;
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

    return (
        <RelationshipContext.Provider value={{ ...state, updateStartDate, updateDaveDate, addIdea, removeIdea, updateIdea }}>
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
