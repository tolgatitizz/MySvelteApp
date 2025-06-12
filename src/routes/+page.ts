// C:\SvelteProjects\myApp\src\routes\+page.ts

import { v4 as uuidv4 } from 'uuid';
import type { PageLoad } from './$types';

type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

// Dikkat: Artık Meteoblue API anahtarı ve doğrudan URL burada yok!
// Bunun yerine kendi API endpoint'imize istek göndereceğiz.
const INTERNAL_WEATHER_API_URL = '/api/weather'; // Kendi oluşturduğumuz endpoint'in yolu


export const load: PageLoad = async ({ fetch }) => {
  const fetchedTodos: Todo[] = [
    { id: uuidv4(), text: 'SvelteKit load fonksiyonunu anla', completed: false },
    { id: uuidv4(), text: 'API veri çekme mantığını simüle et', completed: false },
    { id: uuidv4(), text: 'SvelteKit dokümantasyonunu incele', completed: true },
    { id: uuidv4(), text: 'Egzersiz yap', completed: false }
  ];

  let weatherData: any = null;
  let weatherError: string | null = null;

  try {
    // Kendi oluşturduğumuz API endpoint'ine istek gönderiyoruz.
    const response = await fetch(INTERNAL_WEATHER_API_URL);

    if (!response.ok) {
      const errorJson = await response.json(); // Hata mesajını JSON olarak bekliyoruz
      throw new Error(`Kendi hava durumu endpoint'imizden hata oluştu: ${response.status} - ${errorJson.error || 'Bilinmeyen Hata'}`);
    }

    weatherData = await response.json(); // Endpoint'ten gelen işlenmiş veriyi alıyoruz

  } catch (error) {
    console.error('Hava durumu verisi çekilemedi:', error);
    weatherError = `Hava durumu bilgileri yüklenemedi: ${(error as Error).message}.`;
  }

  // load fonksiyonu bir obje döndürmelidir.
  return {
    todos: fetchedTodos,
    weather: weatherData,
    error: weatherError
  };
};

// getWeatherDescription fonksiyonunu buradan kaldırdık, çünkü artık +server.ts içinde.