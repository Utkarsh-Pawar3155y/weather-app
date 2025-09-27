
const apiKey = "a159c2f97428a52c6a158cd77c8ea09d";
const weatherDisplay = document.getElementById("weatherDisplay");
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const bgVideo = document.getElementById("bgVideo"); 


async function getWeather(city) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);

    if (!response.ok) throw new Error("City not found");

    const data = await response.json();
    displayWeather(data);
    updateBackgroundVideo(data.weather[0].main);
  } catch (error) {
    weatherDisplay.innerHTML = `<p style="color:red;">${error.message}</p>`;
  }
}


function getWeatherByLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        displayWeather(data);
        updateBackgroundVideo(data.weather[0].main);
      } catch (error) {
        weatherDisplay.innerHTML = `<p style="color:red;">Failed to fetch location weather</p>`;
      }
    });
  } else {
    alert("Geolocation not supported by your browser");
  }
}


function displayWeather(data) {
  weatherDisplay.innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <p>🌡 Temperature: ${data.main.temp} °C</p>
    <p>☁ Condition: ${data.weather[0].description}</p>
    <p>💧 Humidity: ${data.main.humidity}%</p>
    <p>💨 Wind Speed: ${data.wind.speed} m/s</p>
  `;
}


function updateBackgroundVideo(weather) {
  let videoSrc = "videos/clear.mp4"; // default

  if (weather.includes("Clear")) videoSrc = "videos/clear.mp4";
  else if (weather.includes("Clouds")) videoSrc = "videos/clouds.mp4";
  else if (weather.includes("Rain")) videoSrc = "videos/rain.mp4";
  else if (weather.includes("Snow")) videoSrc = "videos/snow.mp4";
  else if (weather.includes("Thunderstorm")) videoSrc = "videos/thunder.mp4";


  bgVideo.style.opacity = 0;
  setTimeout(() => {
    bgVideo.src = videoSrc;
    bgVideo.load();
    bgVideo.play();
    bgVideo.style.opacity = 0.8;
  }, 500);
}


searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) getWeather(city);
});

locationBtn.addEventListener("click", getWeatherByLocation);
