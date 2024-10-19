export default (location) => {
    const API_KEY = "XEZVKR2YRZPQUXCE6LN2PQAZM";
    if (location.includes("undefined")) {
        location = "london"
    }

    return `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${API_KEY}`;
}
