export async function getUserLocation() {
    try {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;
        return latitude + "," + longitude;
    } catch (error) {
        console.error('Failed to get user location:', error);
        return { error: error.message };
    }
}

export async function getWeatherData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data);
        return data;
    }
    catch (error) {
        console.error('Failed to fetch weather data.', error);
        return { error: error.message };
    }
}
