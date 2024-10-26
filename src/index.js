import "./styles.css";
import { getFormattedData, flipUnits } from "./dataProcessor";
import { renderWeatherData, removeChildren, loadingScreen } from "./ui";

const searchBtn = document.getElementById("search-btn");
const locationBtn = document.getElementById("location-btn");
const searchInput = document.getElementById("search-input");
const unitToggle = document.getElementById("unitToggle");
const unitLabel = document.getElementById("unitLabel");

let isMetric = false;
let weatherData;

function showAlert(message) {
    const alertBox = document.getElementById("alert-box");
    alertBox.textContent = message;
    alertBox.classList.remove("hidden");
    setTimeout(() => alertBox.classList.add("hidden"), 5000);
}

async function fetchAndRenderWeather(location = null) {
    try {
        loadingScreen(true);  // Show loading screen
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
    } catch (error) {
        showAlert("An error occurred while fetching weather data.");
    } finally {
        loadingScreen(false); // Hide loading screen
    }
}

// Initial data fetch
fetchAndRenderWeather();

searchBtn.addEventListener("click", async () => {
    fetchAndRenderWeather(searchInput.value);
});

locationBtn.addEventListener("click", async () => {
    fetchAndRenderWeather();
});

unitToggle.addEventListener("change", () => {
    isMetric = !isMetric;
    unitLabel.textContent = isMetric ? "°C,km/h" : "°F,mph";
    if (weatherData) {
        weatherData = flipUnits(weatherData);
        removeChildren();
        renderWeatherData(weatherData);
    }
});

searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        searchBtn.click();
    }
});

