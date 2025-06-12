// C:\SvelteProjects\myApp\src\routes\api\weather\+server.ts

// SvelteKit'in sunucu modülleri için tip tanımlarını import ediyoruz.
import type { RequestHandler } from '@sveltejs/kit';
// Vite (SvelteKit'in altında çalışan build aracı) ortam değişkenlerini 'import.meta.env' üzerinden sağlar.
// Bu, .env dosyasından METEOBLUE_API_KEY'i almamızı sağlar.
import { env } from '$env/dynamic/private'; // Sunucu tarafı özel değişkenler için

// Meteoblue API için sabitler
// NOT: Koordinatları burada sabit tutuyoruz. İsterseniz bunları da istemciden alabilirsiniz.
const LAT = 37.06; // Gaziantep Enlem
const LON = 37.38; // Gaziantep Boylam
const ASL = 842; // Gaziantep Rakım (metre cinsinden)

// Meteoblue API URL'si
// API anahtarını .env dosyasından alıyoruz.
// >>> BURADAKİ SATIRI DİKKATLİCE KONTROL EDİN VE AŞAĞIDAKİ GİBİ YAPIN <<<
const METEOBLUE_API_URL = `https://my.meteoblue.com/packages/basic-1h_basic-day?apikey=${env.METEOBLUE_API_KEY}&lat=${LAT}&lon=${LON}&asl=${ASL}&format=json`;
// >>> YUKARIDAKİ SATIRDA NORMAL TIRNAK (', ") DEĞİL, TERS TIRNAK (`) KULLANILDIĞINDAN EMİN OLUN <<<

// Debug için console.log ekliyoruz
console.log('Meteoblue API Key (from .env):', env.METEOBLUE_API_KEY ? 'Yüklendi (Gizli)' : 'YÜKLENMEDİ');
console.log('Constructed Meteoblue API URL:', METEOBLUE_API_URL);

// Meteoblue'nun pictocode değerlerini insan tarafından okunabilir açıklamalara çeviren yardımcı fonksiyon.
// Bu fonksiyonu _sunucu tarafında_ veriyi işlerken kullanacağız.
function getWeatherDescription(pictocode: number): string {
    switch (pictocode) {
        case 1: return 'Güneşli';
        case 2: return 'Az bulutlu';
        case 3: return 'Parçalı bulutlu';
        case 4: return 'Bulutlu';
        case 5: return 'Sisli';
        case 6: return 'Hafif çisenti';
        case 7: return 'Hafif yağmur';
        case 8: return 'Orta yağmur';
        case 9: return 'Şiddetli yağmur';
        case 10: return 'Hafif kar';
        case 11: return 'Orta kar';
        case 12: return 'Şiddetli kar';
        case 13: return 'Fırtına';
        case 14: return 'Kar fırtınası';
        case 15: return 'Hafif karla karışık yağmur';
        case 16: return 'Gök gürültülü sağanak yağış';
        case 17: return 'Yağmurlu ve karla karışık';
        case 18: return 'Rüzgarlı';
        case 19: return 'Dolu';
        case 20: return 'Dumanlı';
        case 21: return 'Sisli ve Rüzgarlı';
        case 22: return 'Hafif Yağmur ve Rüzgarlı';
        case 23: return 'Orta Yağmur ve Rüzgarlı';
        case 24: return 'Şiddetli Yağmur ve Rüzgarlı';
        case 25: return 'Hafif Kar ve Rüzgarlı';
        case 26: return 'Orta Kar ve Rüzgarlı';
        case 27: return 'Şiddetli Kar ve Rüzgarlı';
        case 28: return 'Gök gürültülü sağanak ve Rüzgarlı';
        case 29: return 'Dolu ve Rüzgarlı';
        case 30: return 'Dolu ve Gök gürültülü sağanak';
        default: return 'Bilinmiyor';
    }
}


// GET isteğini işleyen fonksiyon. 'RequestHandler' tipi, SvelteKit'in beklediği imzayı sağlar.
// Bu endpoint'e yapılan bir GET isteği geldiğinde bu fonksiyon çalışır.
export const GET: RequestHandler = async () => {
    try {
        // Meteoblue API'ye sunucu tarafında istek gönderiyoruz.
        const response = await fetch(METEOBLUE_API_URL);

        if (!response.ok) {
            const errorText = await response.text();
            // Hata durumunda, istemciye bir hata yanıtı gönderiyoruz.
            return new Response(JSON.stringify({ error: `Harici API hatası: ${response.status} - ${errorText}` }), {
                status: response.status,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const data = await response.json();
        let processedWeatherData: any = null;

        if (data && data.data_day) {
            processedWeatherData = {
                city: data.metadata?.name || 'Gaziantep',
                daily: data.data_day.time.map((time: string, index: number) => ({
                    time: time,
                    maxTemp: data.data_day.temperature_max[index],
                    minTemp: data.data_day.temperature_min[index],
                    pictocode: data.data_day.pictocode[index],
                    precipitationProb: data.data_day.precipitation_probability[index],
                    weatherDescription: getWeatherDescription(data.data_day.pictocode[index])
                }))
            };
        } else {
            return new Response(JSON.stringify({ error: "Meteoblue'dan beklenen hava durumu verisi bulunamadı veya eksik." }), {
                status: 500, // Sunucu tarafı hata
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Başarılı durumda, işlenmiş hava durumu verisini JSON olarak geri döndürüyoruz.
        return new Response(JSON.stringify(processedWeatherData), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('API endpoint hatası:', error);
        // Sunucu tarafında beklenmedik bir hata oluşursa
        return new Response(JSON.stringify({ error: `Sunucu tarafında bilinmeyen bir hata oluştu: ${(error as Error).message}` }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};