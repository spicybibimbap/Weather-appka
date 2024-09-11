const inputBox = document.querySelector('.input-box');
const searchBtn = document.getElementById('searchBtn');
const weather_img = document.querySelector('.weather-img');
const temperature = document.querySelector('.temperature');
const description = document.querySelector('.description');
const humidity = document.getElementById('humidity');
const wind_speed = document.getElementById('wind-speed');

const location_not_found = document.querySelector('.location-not-found');
const weather_body = document.querySelector('.weather-body');

// Funkce pro získání souřadnic z Nominatim OpenStreetMap API podle názvu města
async function getCityCoordinates(city) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.length > 0) {
            const { lat, lon } = data[0];
            return { lat, lon };
        } else {
            console.log("Město nebylo nalezeno.");
            return null;
        }
    } catch (error) {
        console.error("Chyba při získávání souřadnic města:", error);
        return null;
    }
}

// Funkce pro načtení počasí pomocí Open-Meteo API
async function checkWeather(city) {
    const coordinates = await getCityCoordinates(city);
    
    if (!coordinates) {
        location_not_found.style.display = "flex";
        weather_body.style.display = "none";
        console.log("Location not found");
        return;
    }

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coordinates.lat}&longitude=${coordinates.lon}&current_weather=true`;

    try {
        // Načtení aktuálních dat o počasí
        const weatherResponse = await fetch(url);
        const weatherData = await weatherResponse.json();
        const weather = weatherData.current_weather;

        // Skrytí chybové zprávy a zobrazení počasí
        location_not_found.style.display = "none";
        weather_body.style.display = "flex";

        // Zobrazíme aktuální teplotu, popis počasí, vlhkost a vítr
        temperature.innerHTML = `${Math.round(weather.temperature)}°C`;
        description.innerHTML = `Current Weather`; // Open-Meteo neposkytuje podrobný popis
        wind_speed.innerHTML = `${Math.round(weather.windspeed)} Km/H`;

        // Podmínky pro změnu obrázku podle počasí
        if (weather.temperature <= 0) {
            weather_img.src = "/assets/snow.png";  // Sníh
        } else if (weather.temperature > 0 && weather.temperature <= 15) {
            weather_img.src = "/assets/cloud.png";  // Mírné počasí
        } else {
            weather_img.src = "/assets/clear.png";  // Slunečno
        }

        console.log(weatherData);
    } catch (error) {
        console.error("Chyba při získávání dat o počasí:", error);
        location_not_found.style.display = "flex";
        weather_body.style.display = "none";
    }
}

// Spuštění vyhledávání při kliknutí na tlačítko
searchBtn.addEventListener('click', () => {
    checkWeather(inputBox.value);
});

// Spuštění vyhledávání při stisknutí klávesy Enter v textovém poli
inputBox.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        checkWeather(inputBox.value);
    }
});
