// Helper function to convert date string to day name
function getDayName(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
}

export function processWeatherData(response) {

    const currentWeather = {
        conditions: response.currentConditions.conditions,
        datetime: response.currentConditions.datetime,
        feelslike: response.currentConditions.feelslike,
        icon: response.currentConditions.icon,
        humidity: response.currentConditions.humidity,
        windspeed: response.currentConditions.windspeed,
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
    }));

    // Forecast for the next 7 days (starting from tomorrow)
    const weeklyForecast = response.days.slice(1, 8).map(day => ({
        day: getDayName(day.datetime),
        tempmin: day.tempmin,
        tempmax: day.tempmax,
        icon: day.icon,
        humidity: day.humidity,
    }));

    return {
        currentWeather,
        hourlyConditions,
        weeklyForecast,
    };
}
