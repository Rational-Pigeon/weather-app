import "./styles.css";
import { getFormattedData, flipUnits } from "./dataProcessor";
import { renderWeatherData, removeChildren } from "./ui";

const searchBtn = document.getElementById("search-btn");
const locationBtn = document.getElementById("location-btn");
const searchInput = document.getElementById("search-input");
export let weatherData = await getFormattedData();
let location;
const unitToggle = document.getElementById('unitToggle');
const unitLabel = document.getElementById('unitLabel');

function showAlert(message) {
    const alertBox = document.getElementById("alert-box");
    alertBox.textContent = message;
    alertBox.classList.remove("hidden");

    // Hide alert after 5 seconds
    setTimeout(() => alertBox.classList.add("hidden"), 5000);
}

console.log(weatherData);
renderWeatherData(weatherData);



searchBtn.addEventListener("click", async () => {
    location = searchInput.value;
    weatherData = await getFormattedData(location);
    if (weatherData.error) {
        showAlert(weatherData.error);
    } else {
        removeChildren();
        renderWeatherData(weatherData);
    }
});

locationBtn.addEventListener("click", async () => {
    weatherData = await getFormattedData();
    if (weatherData.error) {
        showAlert(weatherData.error);
    } else {
        removeChildren();
        renderWeatherData(weatherData);
    }
});

unitToggle.addEventListener("change", function() {
    if (weatherData.error) {
        showAlert("Cannot switch units without valid weather data.");
    } else {
        unitLabel.textContent = this.checked ? "°C,km/h" : "°F,mph";
        weatherData = flipUnits(weatherData);
        removeChildren();
        renderWeatherData(weatherData);
    }
});
