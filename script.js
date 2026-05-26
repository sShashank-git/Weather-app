async function getCity(cityName) {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}`);
    const data = await response.json();
    console.log("City info:")
    console.log(data);
    return data;
}
async function getWeather(cityName) {
    const cityData = await getCity(cityName);
    if (!cityData.results) {
        alert("City not found");
        return;
    }
    const lat = cityData.results[0].latitude;
    const lon = cityData.results[0].longitude;
    const city = cityData.results[0].name;
    const coun = cityData.results[0].country; 

    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,apparent_temperature&daily=sunrise,sunset`);
    const data = await response.json();
    console.log("Weather Data:");
    console.log(data);

    const temperature = document.getElementById("temperature");
    const wind = document.getElementById("wind");
    const humidity = document.getElementById("humidity");

    const currentHour = data.current.time.slice(0, 13) + ":00";
    const startIndex = data.hourly.time.indexOf(currentHour);
    const cityElement = document.getElementById("cityName");

    const maxTemp = Math.max(...data.hourly.temperature_2m);
    const minTemp = Math.min(...data.hourly.temperature_2m);
    const minmax = document.getElementById("minmax");
    const feelsLike = document.getElementById("feelsLike")

    const sunrise = new Date(data.daily.sunrise[0]);
    const sunset = new Date(data.daily.sunset[0]);
    const now = new Date(data.current.time);

    const totalDayLight = sunset - sunrise;
    const passed = now - sunrise;
    const percentage = (passed/totalDayLight)*100;

    const progress = document.querySelector(".sun-progress");

    // card 4 : Sunrise/Sunset Progress
    progress.style.width = percentage + "%";

    document.getElementById("sunrise").innerText = sunrise.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
    document.getElementById("sunset").innerText = sunset.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
    
    temperature.innerText = data.current.temperature_2m + "°C";
    cityElement.innerText = `${city}, ${coun}`;

    wind.innerText = "Wind Speed: " + data.current.wind_speed_10m + "km/hr";
    
    humidity.innerText = "Humidity: " + data.hourly.relative_humidity_2m[0] + "%";

    // Min and Max temperature (card 1)

    minmax.innerText = `Max: ${maxTemp}°  Min: ${minTemp}°`;

    // Feels Like (card 4)
    feelsLike.innerText = "Feels Like: " + data.hourly.apparent_temperature[startIndex] + "°"
    

    // forcast part (card 6)
    const forcastContainer = document.getElementById("forcastContainer");
    forcastContainer.innerHTML = "";
    for(let i = startIndex; i<startIndex + 12; i++){
        const time = data.hourly.time[i];
        const temp = data.hourly.temperature_2m[i];

        forcastContainer.innerHTML += `
        <div class="forcast-card">
            <h3>${time.slice(11,16)}</h3>
            <p>${temp}°C</p>
        </div>
        `;
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("searchBtn");
    button.addEventListener("click", () => {
        const city = document.getElementById("cityInput").value;
        getWeather(city);
    });
});