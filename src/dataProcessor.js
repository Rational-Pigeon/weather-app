import { getUserLocation, getWeatherData, getCityName } from "./fetch";
import urlComposer from "./url-composer";

// Helper function to convert date string to day name
function getDayName(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
}

async function processWeatherData(response) {
    if (!response || response.error || !response.days || !response.currentConditions) {
        return { error: "Could not retrieve weather data. Please check the city name and try again." };
    }

    const city = await getCityName(response.resolvedAddress);

    let unitSystem = "imperial";

    const currentWeather = {
        day: getDayName(response.days[0].datetime),
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
    const hoursTomorrow = response.days[1]?.hours.slice(0, 23 - hoursToday.length) || [];
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
        unitSystem,
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

export function flipUnits(weatherData) {

    switch (weatherData.unitSystem) {
        case "imperial":
            // Convert current weather
            weatherData.currentWeather.feelslike = fahrenheitToCelsius(weatherData.currentWeather.feelslike);
            weatherData.currentWeather.tempmin = fahrenheitToCelsius(weatherData.currentWeather.tempmin);
            weatherData.currentWeather.tempmax = fahrenheitToCelsius(weatherData.currentWeather.tempmax);
            weatherData.currentWeather.windspeed = mphToKmh(weatherData.currentWeather.windspeed);

            // Convert hourly conditions
            weatherData.hourlyConditions.forEach(hour => {
                hour.feelslike = fahrenheitToCelsius(hour.feelslike);
                hour.windspeed = mphToKmh(hour.windspeed);
            });

            // Convert weekly forecast
            weatherData.weeklyForecast.forEach(day => {
                day.tempmin = fahrenheitToCelsius(day.tempmin);
                day.tempmax = fahrenheitToCelsius(day.tempmax);
                day.windspeed = mphToKmh(day.windspeed);
            });

            // Switch to metric
            weatherData.unitSystem = "metric";
            break;

        case "metric":
            // Convert current weather
            weatherData.currentWeather.feelslike = celsiusToFahrenheit(weatherData.currentWeather.feelslike);
            weatherData.currentWeather.tempmin = celsiusToFahrenheit(weatherData.currentWeather.tempmin);
            weatherData.currentWeather.tempmax = celsiusToFahrenheit(weatherData.currentWeather.tempmax);
            weatherData.currentWeather.windspeed = kmhToMph(weatherData.currentWeather.windspeed);

            // Convert hourly conditions
            weatherData.hourlyConditions.forEach(hour => {
                hour.feelslike = celsiusToFahrenheit(hour.feelslike);
                hour.windspeed = kmhToMph(hour.windspeed);
            });

            // Convert weekly forecast
            weatherData.weeklyForecast.forEach(day => {
                day.tempmin = celsiusToFahrenheit(day.tempmin);
                day.tempmax = celsiusToFahrenheit(day.tempmax);
                day.windspeed = kmhToMph(day.windspeed);
            });

            // Switch to imperial
            weatherData.unitSystem = "imperial";
            break;

        default:
            throw new Error("Unknown unit system");
    }

    return weatherData;
}


function fahrenheitToCelsius(f) {
    return (((f - 32) * 5) / 9).toFixed(1);
}

function celsiusToFahrenheit(c) {
    return ((c * 9 / 5) + 32).toFixed(1);
}

function mphToKmh(mph) {
    return (mph * 1.60934).toFixed(1);
}

function kmhToMph(kmh) {
    return (kmh / 1.60934).toFixed(1);
}
