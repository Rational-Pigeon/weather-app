import "./styles.css";
import { getFormattedData, flipUnits } from "./dataProcessor";
import { renderWeatherData, removeChildren } from "./ui";

const searchBtn = document.getElementById("search-btn");
const locationBtn = document.getElementById("location-btn");
const searchInput = document.getElementById("search-input");
export let weatherData = await flipUnits(await getFormattedData());
let location;
const unitToggle = document.getElementById('unitToggle');
const unitLabel = document.getElementById('unitLabel');

console.log(weatherData);
renderWeatherData(weatherData);



searchBtn.addEventListener("click", async () => {
    location = searchInput.value;
    weatherData = await flipUnits(await getFormattedData(location));
    console.log(weatherData);
    removeChildren();
    renderWeatherData(weatherData);
});

locationBtn.addEventListener("click", async () => {
    weatherData = await flipUnits(await getFormattedData());
    removeChildren();
    renderWeatherData(weatherData);
});

unitToggle.addEventListener('change', function() {
    if (this.checked) {
        unitLabel.textContent = "°C,km/h";
        // Call flipUnits function to switch to metric
        weatherData = flipUnits(weatherData); // Assumes you have access to weatherData
    } else {
        unitLabel.textContent = "°F,mph";
        // Call flipUnits function to switch back to imperial
        weatherData = flipUnits(weatherData); // Assumes you have access to weatherData
    }
    console.log(weatherData);
});
