export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter' | 'Any';
export type Priority = 'Low' | 'Medium' | 'High';

export interface Idea {
    id: string;
    type: 'EXPERIENCE' | 'GIFT';
    title: string;
    image?: string;
    priority: Priority;
    // Experience specific
    season?: Season;
    // Gift specific
    link?: string;
    // Meta
    createdAt: number;
}

export interface RelationshipState {
    startDate: string; // ISO Date string
    daveDate: string; // ISO Date string
    ideas: Idea[];
}
