
import { WeatherData } from '../types';

// Coordinates for Ouagadougou
const LAT = 12.3714;
const LON = -1.5197;

export const fetchOuagaWeather = async (): Promise<WeatherData> => {
  try {
    // Ouagadougou is GMT (UTC+0).
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current_weather=true&hourly=relativehumidity_2m&timezone=GMT`
    );

    if (!response.ok) {
      throw new Error(`Erreur récupération météo: ${response.status}`);
    }

    const data = await response.json();
    const current = data.current_weather;
    
    // Get approximate current humidity based on current hour
    const currentHour = new Date().getUTCHours();
    const humidity = data.hourly?.relativehumidity_2m?.[currentHour] || 50;

    if (!current) {
        throw new Error('Données météo manquantes');
    }

    return {
      temperature: current.temperature,
      weatherCode: current.weathercode,
      description: getWeatherDescription(current.weathercode),
      isDay: current.is_day === 1,
      windSpeed: current.windspeed,
      humidity: humidity
    };
  } catch (error) {
    console.error('Weather Service Error:', error);
    throw error;
  }
};

// Convert WMO Weather Codes to French descriptions
const getWeatherDescription = (code: number): string => {
  if (code === 0) return 'Ciel dégagé';
  if (code === 1) return 'Principalement dégagé';
  if (code === 2) return 'Partiellement nuageux';
  if (code === 3) return 'Nuageux';
  if (code >= 45 && code <= 48) return 'Brume / Brouillard';
  if (code >= 51 && code <= 55) return 'Bruine légère';
  if (code >= 61 && code <= 65) return 'Pluie';
  if (code >= 66 && code <= 67) return 'Pluie verglaçante';
  if (code >= 71 && code <= 77) return 'Chute de neige';
  if (code >= 80 && code <= 82) return 'Averses de pluie';
  if (code >= 95) return 'Orages';
  return 'Temps variable';
};
