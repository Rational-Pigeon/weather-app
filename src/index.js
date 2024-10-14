import "./styles.css";
import { getWeatherData, getUserLocation, getCityName } from "./fetch";
import { processWeatherData } from "./dataProcessor";

const API_KEY = "XEZVKR2YRZPQUXCE6LN2PQAZM";
let url;
let city;
const { latitude, longitude } = await getUserLocation();

// formatting default fetch url on first time running the app.
if (latitude && longitude) {
    url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude},${longitude}?key=${API_KEY}`;
}
else {
    url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/london?key=${API_KEY}`
}

city = await getCityName(latitude, longitude);
let weatherData = await getWeatherData(url);

console.log(processWeatherData(weatherData));
