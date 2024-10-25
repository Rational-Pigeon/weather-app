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

function renderHourlyWeather(weatherData) {
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
            <p class="font-bold">${forecast.feelslike}<sup class="temp">°C</sup></p>
            <div class="flex gap-4">
                <div class="flex flex-col justify-center items-center">
                    <img class="w-6 h-6" src="${humidityIcon}" alt="humidity icon">
                    <p>${Math.round(forecast.humidity)}%</p>
                </div>
                <div class="flex flex-col justify-center items-center">
                    <img class="w-6 h-6" src="${windSpeedIcon}" alt="humidity icon">
                    <p>${Math.round(forecast.windspeed)}<span class="velocity">km/h</span></p>
                </div>
            </div>
        </div>`
    }
    container.appendChild(title);
    container.appendChild(hourlyGrid);
}

function renderWeeklyForecast() { }

export function loadingScreen() { }
