
export interface Message {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
  groundingSources?: Array<{
    title: string;
    uri: string;
  }>;
  generatedImageUrl?: string;
  isGeneratingImage?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  date: number; // timestamp
  messages: Message[];
}

export interface TrustedSource {
  name: string;
  category: 'Presse' | 'Radio' | 'TV' | 'Agence';
  description: string;
  url?: string;
}

export interface HeritageSite {
  id: string;
  name: string;
  location: string;
  description: string;
  imageUrl?: string; // Optional to allow AI generation if missing
  tags: string[];
  websiteUrl?: string; // Kept for backward compatibility or primary link
  detailedDescription?: string;
  externalLinks?: Array<{
    label: string;
    url: string;
  }>;
  museumUrl?: string;
}

export interface RadioStation {
  id: string;
  name: string;
  frequency: string;
  description: string;
  website?: string;
  listenUrl?: string; // Lien direct audio
  watchUrl?: string;  // Lien direct TV
  color: string;
}

export interface WeatherData {
  temperature: number;
  weatherCode: number;
  description: string;
  isDay: boolean;
  windSpeed: number; // km/h
  humidity: number; // %
}

// --- NEW TYPES FOR SUPER APP FEATURES ---

export interface Region {
  id: string;
  name: string;
  capital: string;
  climate: string;
  description: string;
  population: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index
  explanation: string;
}

export interface Pharmacy {
  name: string;
  location: string;
  phone?: string;
}

export enum ViewState {
  CHAT = 'CHAT',
  HERITAGE = 'HERITAGE',
  RADIOS = 'RADIOS',
  ABOUT = 'ABOUT',
  // New Views
  PHARMACIES = 'PHARMACIES',
  QUIZ = 'QUIZ'
}