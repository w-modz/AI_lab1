class WeatherApp {
    constructor() {
        this.apiKey = '7ded80d91f2b280ec979100cc8bbba94';
        this.addressInput = document.getElementById('addressInput');
        this.weatherBtn = document.getElementById('weatherBtn');
        this.weatherDisplay = document.getElementById('weatherDisplay');
        
        this.initEventListeners();
    }

    initEventListeners() {
        // Obsługa kliknięcia przycisku
        this.weatherBtn.addEventListener('click', () => {
            this.getWeather();
        });

        // Obsługa naciśnięcia Enter w polu tekstowym
        this.addressInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.getWeather();
            }
        });
    }

    async getWeather() {
        const address = this.addressInput.value.trim();
        
        if (!address) {
            this.displayError('Proszę wprowadzić adres.');
            return;
        }

        this.displayLoading();

        try {
            // Pobieranie współrzędnych geograficznych
            const coordinates = await this.getCoordinates(address);
            
            if (coordinates) {
                console.log('Latitude:', coordinates.lat);
                console.log('Longitude:', coordinates.lon);
                
                // Przykładowe dane - do zastąpienia rzeczywistym API pogodowym
                this.displayWeather({
                    location: `${coordinates.name}, ${coordinates.country}`,
                    temperature: 'test',
                    description: 'test',
                    humidity: 'test',
                    wind: 'test'
                });
            }

        } catch (error) {
            console.error('Błąd pobierania pogody:', error);
            this.displayError('Wystąpił błąd podczas pobierania danych pogodowych.');
        }
    }

    async getCoordinates(address) {
        try {
            const geocodingUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(address)}&limit=1&appid=${this.apiKey}`;
            
            console.log('Pobieranie współrzędnych dla:', address);
            
            const response = await fetch(geocodingUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.length === 0) {
                this.displayError('Nie znaleziono lokalizacji dla podanego adresu.');
                return null;
            }
            
            return {
                lat: data[0].lat,
                lon: data[0].lon,
                name: data[0].name,
                country: data[0].country
            };
            
        } catch (error) {
            console.error('Błąd pobierania współrzędnych:', error);
            this.displayError('Nie udało się pobrać współrzędnych dla podanego adresu.');
            return null;
        }
    }

    displayLoading() {
        this.weatherDisplay.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <div style="font-size: 18px;">Pobieranie danych pogodowych...</div>
                <div style="margin-top: 10px; opacity: 0.7;">Proszę czekać</div>
            </div>
        `;
    }

    displayWeather(weatherData) {
        this.weatherDisplay.innerHTML = `
            <div style="text-align: center;">
                <h2 style="margin: 0 0 20px 0; color: #fff;">${weatherData.location}</h2>
                <div style="font-size: 48px; font-weight: bold; margin: 20px 0;">${weatherData.temperature}</div>
                <div style="font-size: 20px; margin: 10px 0; opacity: 0.9;">${weatherData.description}</div>
                <div style="display: flex; justify-content: space-around; margin-top: 30px; flex-wrap: wrap;">
                    <div style="text-align: center; margin: 10px;">
                        <div style="opacity: 0.7;">Wilgotność</div>
                        <div style="font-size: 18px; font-weight: bold;">${weatherData.humidity}</div>
                    </div>
                    <div style="text-align: center; margin: 10px;">
                        <div style="opacity: 0.7;">Wiatr</div>
                        <div style="font-size: 18px; font-weight: bold;">${weatherData.wind}</div>
                    </div>
                </div>
            </div>
        `;
    }

    displayError(message) {
        this.weatherDisplay.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #ff7675;">
                <div style="font-size: 18px;">⚠️ ${message}</div>
            </div>
        `;
    }
}

// Inicjalizacja aplikacji po załadowaniu strony
document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});