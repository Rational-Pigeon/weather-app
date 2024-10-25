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
}

function renderCurrentWeather(weatherData) {
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
        <p class="text-sky-700 font-bold">${weatherData.currentWeather.tempmin}<sup class="temp">°C</sup></p>
        <p class="text-3xl text-gray-600">/</p>
        <p class=" text-rose-600 font-bold">${weatherData.currentWeather.tempmax}<sup class="temp">°C</sup></p>
    </div>`

    const iconPath = require(`./img/${weatherData.currentWeather.icon}.svg`);

    const iconAndTemp = `
        <div class="flex items-center text-4xl font-bold text-gray-600 gap-2">
            <img src="${iconPath}" alt="${weatherData.currentWeather.icon} icon" class="w-28 h-28">
            <div class="flex flex-col items-center">
                <p>${weatherData.currentWeather.feelslike} <sup class="temp">°C</sup> </p>
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
            <p>${weatherData.currentWeather.windspeed}<span class="velocity">km/h</span></p>
        </div>
    </div>`
    currentWeatherContainer.innerHTML = city + dayAndTime + minAndMax + iconAndTemp + windAndHumidity;
    container.appendChild(currentWeatherContainer);
}

function renderHourlyWeather() { }

function renderWeeklyForecast() { }

export function loadingScreen() { }
