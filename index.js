const apiKey = '69ea3d34639d1f7ca2e63d04decee1ae';

const fetchWeather = async (city) => {
  try {
    // Fetch current weather data
    const currentWeatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`);
    const currentWeatherData = await currentWeatherResponse.json();

    // Fetch 5-day forecast data
    const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`);
    const forecastData = await forecastResponse.json();

    // Display current weather
    displayCurrentWeather(currentWeatherData);

    // Display 5-day forecast
    displayForecast(forecastData);

    // Add city to search history and save to localStorage
    addToHistory(city);
    saveToLocalStorage(city);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    alert('Error fetching weather data. Please try again.');
  }
};

const displayCurrentWeather = (data) => {
  const currentWeatherDiv = document.getElementById('currentWeather');
  currentWeatherDiv.innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <p>Date: ${new Date().toLocaleDateString()}</p>
    <p>Temperature: ${data.main.temp}°F</p>
    <p>Humidity: ${data.main.humidity}%</p>
    <p>Wind Speed: ${data.wind.speed} mph</p>
    <p>Weather Conditions: ${data.weather[0].description}</p>
  `;
};

const displayForecast = (data) => {
  const forecastWeatherDiv = document.getElementById('forecastWeather');
  const forecastList = data.list.slice(0, 5); // Displaying data for the next 5 days

  forecastWeatherDiv.innerHTML = '<h2>5-Day Forecast</h2>';

  forecastList.forEach((forecast) => {
    const date = new Date(forecast.dt * 1000).toLocaleDateString();

    const forecastItem = document.createElement('div');
    forecastItem.classList.add('forecast-item');

    forecastItem.innerHTML = `
      <p>Date: ${date}</p>
      <p>Temperature: ${forecast.main.temp}°F</p>
      <p>Humidity: ${forecast.main.humidity}%</p>
      <p>Wind Speed: ${forecast.wind.speed} mph</p>
      <p>Weather Conditions: ${forecast.weather[0].description}</p>
    `;

    forecastWeatherDiv.appendChild(forecastItem);
  });
};

const addToHistory = (city) => {
  const historyBtnDiv = document.getElementById('historyBtn');
  const historyBtn = document.createElement('button');
  historyBtn.textContent = city;
  historyBtn.addEventListener('click', () => {
    // When a city in the search history is clicked, fetch and display weather again
    fetchWeather(city);
  });
  historyBtnDiv.appendChild(historyBtn);
};

const saveToLocalStorage = (city) => {
  // Get existing search history from localStorage
  const existingHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

  // Add the new city to the history
  existingHistory.push(city);

  // Save the updated history back to localStorage
  localStorage.setItem('searchHistory', JSON.stringify(existingHistory));
};

const clearSearchHistory = () => {
  // Clear the search history from both UI and localStorage
  const historyBtnDiv = document.getElementById('historyBtn');
  historyBtnDiv.innerHTML = ''; // Clear the buttons from UI
  localStorage.removeItem('searchHistory'); // Clear the search history from localStorage
};

// Load search history from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
  const existingHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

  // Display existing search history
  existingHistory.forEach((city) => {
    addToHistory(city);
  });

  // Event listener for the submit button
  document.getElementById('submit').addEventListener('click', () => {
    const cityInput = document.getElementById('city');
    const city = cityInput.value.trim();

    if (city) {
      // Fetch weather information for the specified city
      fetchWeather(city);
    } else {
      alert('Please enter a city name');
    }
  });

  // Event listener for the clear history button
  document.getElementById('clearHistory').addEventListener('click', clearSearchHistory);
});

// You may consider adding additional logic to handle localStorage for search history
// For simplicity, this example doesn't include localStorage functionality.

