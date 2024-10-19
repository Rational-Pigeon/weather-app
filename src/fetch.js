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

export async function getCityName(resolvedAddress) {
    if (isNaN(resolvedAddress.at(0))) {
        return resolvedAddress.split(",")[0].trim();
    }
    else {
        const apiKey = 'be2777ed166c4859ad32ef1b6915e120';
        console.log(resolvedAddress);
        const [latitude, longitude] = resolvedAddress.split(",");
        console.log(latitude, longitude);
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            const city = data.results[0].components.city || data.results[0].components.town || data.results[0].components.village;
            return city;
        } catch (error) {
            console.error('Failed to get city name:', error);
            return { error: error.message };
        }
    }
}
