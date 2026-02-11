export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter' | 'Any';
export type Priority = 'Low' | 'Medium' | 'High';

export interface Place {
    id: string;
    name: string;
    lat: number;
    lng: number;
    dateVisited?: string;
    description?: string;
}

export interface Idea {
    id: string;
    type: 'EXPERIENCE' | 'GIFT' | 'MOVIE';
    title: string;
    image?: string;
    priority: Priority;
    // Experience specific
    season?: Season;
    // Gift specific
    link?: string;
    // Movie specific
    suggestedBy?: 'Manolo' | 'Pilar' | 'Ambos';
    // Meta
    createdAt: string;
}

export interface RelationshipState {
    startDate: string; // ISO Date string
    daveDate: string; // ISO Date string
    ideas: Idea[];
    places: Place[];
}
