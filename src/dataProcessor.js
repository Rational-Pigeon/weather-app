import { getUserLocation, getWeatherData } from "./fetch";
import urlComposer from "./url-composer";

// Helper function to convert date string to day name
function getDayName(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
}

async function getCityName(resolvedAddress) {
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

async function processWeatherData(response) {
    const city = await getCityName(response.resolvedAddress);
    console.log(city);

    const currentWeather = {
        conditions: response.currentConditions.conditions,
        datetime: response.currentConditions.datetime,
        feelslike: response.currentConditions.feelslike,
        icon: response.currentConditions.icon,
        humidity: response.currentConditions.humidity,
        windspeed: response.currentConditions.windspeed,
        sunset: response.currentConditions.sunset,
        sunrise: response.currentConditions.sunrise,
        tempmin: response.days[0].tempmin,
        tempmax: response.days[0].tempmax,
    };

    // Hourly conditions for the next 23 hours starting from the current hour
    const currentHourEpoch = response.currentConditions.datetimeEpoch;
    const hoursToday = response.days[0].hours.filter(hour => hour.datetimeEpoch > currentHourEpoch);

    // If fewer than 23 hours left in the current day, include hours from the next day
    const hoursTomorrow = response.days[1].hours.slice(0, 23 - hoursToday.length);
    const hourlyConditions = [...hoursToday, ...hoursTomorrow].map(hour => ({
        feelslike: hour.feelslike,
        datetime: hour.datetime,
        icon: hour.icon,
        humidity: hour.humidity,
        windspeed: hour.windspeed,
    }));

    // Forecast for the next 7 days (starting from tomorrow)
    const weeklyForecast = response.days.slice(1, 8).map(day => ({
        day: getDayName(day.datetime),
        tempmin: day.tempmin,
        tempmax: day.tempmax,
        icon: day.icon,
        humidity: day.humidity,
        windspeed: day.windspeed,
    }));

    return {
        city,
        currentWeather,
        hourlyConditions,
        weeklyForecast,
    };
}

export async function getFormattedData(location) {
    location = location ? location : await getUserLocation();
    return processWeatherData(await getWeatherData(urlComposer(location)));
};
