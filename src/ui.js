const humidityIcon = require("./img/humidity.svg");
const windSpeedIcon = require("./img/wind-speed.svg");
const container = document.querySelector("#body-container")

export function removeChildren(element = container) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

export function renderWeatherData(weatherData) {
    renderCurrentWeather(weatherData);
    renderHourlyWeather(weatherData);
    renderWeeklyForecast(weatherData);
}

function renderCurrentWeather(weatherData) {
    const unitSystem = weatherData.unitSystem;
    const currentWeatherContainer = document.createElement("div"); currentWeatherContainer.classList.add("grid", "grid-cols-2",
        "grid-rows-[3fr_1fr_3fr]", "place-items-center", "w-2/5", "justify-center", "rounded-lg", "bg-slate-300", "p-4");

    const city = `<h2 class="text-6xl font-bold col-span-2">${weatherData.city}</h2>`
    const dayAndTime = `
    <div class="flex text-2xl gap-8 items-center">
        <p>${weatherData.currentWeather.day}</p>
        <p>${weatherData.currentWeather.datetime}</p>
    </div>`

    const minAndMax = `
    <div class="flex text-2xl items-center gap-1">
        <p class="text-sky-700 font-bold">${weatherData.currentWeather.tempmin}
            <sup class="temp text-gray-800">${unitSystem === "imperial" ? "°F" : "°C"}</sup></p>
        <p class="text-3xl text-gray-600">/</p>
        <p class=" text-rose-600 font-bold">${weatherData.currentWeather.tempmax}<sup class="temp text-gray-800">${unitSystem === "imperial" ? "°F" : "°C"}</sup></p>
    </div>`

    const iconPath = require(`./img/${weatherData.currentWeather.icon}.svg`);

    const iconAndTemp = `
        <div class="flex items-center text-4xl font-bold text-gray-600 gap-2">
            <img src="${iconPath}" alt="${weatherData.currentWeather.icon} icon" class="w-28 h-28">
            <div class="flex flex-col items-center">
                <p>${weatherData.currentWeather.feelslike} <sup class="temp">${unitSystem === "imperial" ? "°F" : "°C"}</sup> </p>
                <p class="text-gray-800 text-xl font-semibold">${weatherData.currentWeather.conditions}</p>
            </div>
        </div>
        `



    const windAndHumidity = `
    <div class="flex gap-4 justify-center">
        <div class="flex flex-col items-center">
            <img class="w-8 h-8" src="${humidityIcon}" alt="humidity icon">
            <p>${weatherData.currentWeather.humidity}</p>
        </div>
        <div class="flex flex-col items-center">
            <img class="w-8 h-8" src="${windSpeedIcon}" alt="wind-speed icon">
            <p>${weatherData.currentWeather.windspeed}<span class="velocity">
                ${unitSystem === "imperial" ? "mph" : "km/h"}</span></p>
        </div>
    </div>`
    currentWeatherContainer.innerHTML = city + dayAndTime + minAndMax + iconAndTemp + windAndHumidity;
    container.appendChild(currentWeatherContainer);
}

function renderHourlyWeather(weatherData) {
    const unitSystem = weatherData.unitSystem;
    const hourlyGrid = document.createElement("div");
    const title = document.createElement("h2");
    title.classList.add("text-4xl", "font-bold", "text-gray-600");
    title.innerText = "Hourly Forecast"

    hourlyGrid.classList.add("grid", "grid-flow-col", "gap-4", "overflow-x-scroll",
        "w-3/5", "bg-slate-400", "p-4", "rounded-xl");

    for (let forecast of weatherData.hourlyConditions) {
        const icon = require(`./img/${forecast.icon}.svg`);

        hourlyGrid.innerHTML += `
        <div class="min-w-[150px] flex flex-col rounded-xl bg-slate-300 justify-center items-center gap-2 p-2">
            <p>${forecast.datetime}</p>
            <img class="w-16 h-16" src="${icon}" alt="${forecast.icon} icon">
            <p class="font-bold">${forecast.feelslike}<sup class="temp">${unitSystem === "imperial" ? "°F" : "°C"}</sup></p>
            <div class="flex gap-4">
                <div class="flex flex-col justify-center items-center">
                    <img class="w-6 h-6" src="${humidityIcon}" alt="humidity icon">
                    <p>${Math.round(forecast.humidity)}%</p>
                </div>
                <div class="flex flex-col justify-center items-center">
                    <img class="w-6 h-6" src="${windSpeedIcon}" alt="humidity icon">
                    <p>${Math.round(forecast.windspeed)}<span class="velocity">${unitSystem === "imperial" ? "mph" : "km/h"}</span></p>
                </div>
            </div>
        </div>`
    }
    container.appendChild(title);
    container.appendChild(hourlyGrid);
}

function renderWeeklyForecast(weatherData) {
    const unitSystem = weatherData.unitSystem;
    const weeklyGrid = document.createElement("div");
    weeklyGrid.classList.add("grid", "grid-cols-5", "gap-0", "w-3/5", "mb-8");

    const title = document.createElement("h2");
    title.classList.add("text-4xl", "font-bold", "text-gray-600");
    title.innerText = "Weekly Forecast"

    weatherData.weeklyForecast.forEach((day, index) => {
        const icon = require(`./img/${day.icon}.svg`);

        const bgColorClass = index % 2 === 0 ? "bg-slate-300" : "bg-slate-400";

        weeklyGrid.innerHTML += `
        <div class="flex flex-col items-center justify-center ${bgColorClass} p-2 rounded-l-xl">
            <p class="text-bold text-lg">${day.day}</p>
        </div>
        <div class="flex justify-center items-center ${bgColorClass} p-2">
            <img class="w-16 h-16" src="${icon}" alt="${day.icon} icon">
        </div>
        <div class="flex flex-col items-center justify-center ${bgColorClass} p-2">
            <img class="w-6 h-6" src="${humidityIcon}" alt="humidity icon">
            <p>${day.humidity}%</p>
        </div>
        <div class="flex flex-col items-center justify-center ${bgColorClass} p-2">
            <img class="w-6 h-6" src="${windSpeedIcon}" alt="wind speed icon">
            <p>${day.windspeed}<span class="windspeed">km/h</span></p>
        </div>
        <div class="flex justify-center items-center ${bgColorClass} p-2 space-x-1 rounded-r-xl">
            <p class="text-sky-700">${day.tempmin}<sup class="temp text-gray-800">${unitSystem === "imperial" ? "°F" : "°C"}</sup></p>
            <p class="text-lg">/</p>
            <p class="text-rose-600">${day.tempmax}<sup class="temp text-gray-800">${unitSystem === "imperial" ? "°F" : "°C"}</sup></p>
        </div>
        `;
    });
    container.appendChild(title);
    container.appendChild(weeklyGrid)
}

export function loadingScreen() { }
