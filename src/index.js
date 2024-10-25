import "./styles.css";
import { getFormattedData, flipUnits } from "./dataProcessor";
import { renderWeatherData, removeChildren } from "./ui";

const searchBtn = document.getElementById("search-btn");
const locationBtn = document.getElementById("location-btn");
const searchInput = document.getElementById("search-input");
const unitToggle = document.getElementById("unitToggle");
const unitLabel = document.getElementById("unitLabel");

let isMetric = false;
let weatherData = await getFormattedData();
if (isMetric) {
    weatherData = flipUnits(weatherData);
}
renderWeatherData(weatherData);

function showAlert(message) {
    const alertBox = document.getElementById("alert-box");
    alertBox.textContent = message;
    alertBox.classList.remove("hidden");
    setTimeout(() => alertBox.classList.add("hidden"), 5000);
}

searchBtn.addEventListener("click", async () => {
    const location = searchInput.value;
    weatherData = await getFormattedData(location);
    if (weatherData.error) {
        showAlert(weatherData.error);
    } else {
        if (isMetric) {
            weatherData = flipUnits(weatherData);
        }
        removeChildren();
        renderWeatherData(weatherData);
    }
});

locationBtn.addEventListener("click", async () => {
    weatherData = await getFormattedData();
    if (weatherData.error) {
        showAlert(weatherData.error);
    } else {
        if (isMetric) {
            weatherData = flipUnits(weatherData);
        }
        removeChildren();
        renderWeatherData(weatherData);
    }
});

unitToggle.addEventListener("change", () => {
    isMetric = !isMetric;
    unitLabel.textContent = isMetric ? "°C,km/h" : "°F,mph";
    weatherData = flipUnits(weatherData);
    removeChildren();
    renderWeatherData(weatherData);
});
