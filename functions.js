
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#donation-info form');
    const modal = document.getElementById('donation-modal');
    const closeBtn = document.querySelector('.close-btn');
  
    form.addEventListener('submit', (e) => {
      e.preventDefault(); // prevent actual form submission
      modal.style.display = 'flex';
      form.reset();
    });
  
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  
    window.addEventListener('click', (e) => {
      if (e.target == modal) modal.style.display = 'none';
    });
  });

  
  const accordionHeaders = document.querySelectorAll('.accordion-header');

accordionHeaders.forEach(header => {
  header.addEventListener('click', () => {
    const item = header.parentElement;
    item.classList.toggle('active');
  });
});

const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tabContents.forEach(tc => tc.classList.remove('active'));

    tab.classList.add('active');
    document.getElementById(tab.dataset.target).classList.add('active');
  });
});



// Weather API Integration - National Weather Service (NOAA)
document.addEventListener('DOMContentLoaded', () => {
  const weatherBtn = document.getElementById('check-weather');
  const eventSelect = document.getElementById('event-select');
  const weatherDisplay = document.getElementById('weather-display');
  
  // Event locations with coordinates for the API
  const eventLocations = {
    'community-cleanup': { name: 'Freedom Park', lat: 35.1945, lon: -80.8433 },
    'beach-drive': { name: 'Ramsey Creek Beach', lat: 35.4530, lon: -80.8996 },
    'neighborhood-pickup': { name: 'NoDa Neighborhood', lat: 35.2510, lon: -80.8000 },
    'river-restoration': { name: 'Catawba River Park', lat: 35.3733, lon: -81.0046 },
    'school-playground': { name: 'Maplewood Elementary School', lat: 35.2401, lon: -80.7997 },
    'spring-garden': { name: 'Charlotte Community Garden Center', lat: 35.2271, lon: -80.8431 },
    'highway-trash': { name: 'I-85 Rest Stop (North Charlotte)', lat: 35.3083, lon: -80.8474 },
    'recycling-awareness': { name: 'Charlotte City Hall Plaza', lat: 35.2273, lon: -80.8430 }
  };

  weatherBtn.addEventListener('click', async () => {
      const selectedEvent = eventSelect.value;
      
      if (!selectedEvent) {
          showWeatherError('Please select an event first');
          return;
      }

      const location = eventLocations[selectedEvent];
      try {
          await fetchWeather(location.lat, location.lon, location.name);
      } catch (error) {
          showWeatherError(`Failed to get weather data: ${error.message}`);
          console.error('Weather API Error:', error);
      }
  });

  async function fetchWeather(lat, lon, locationName) {
      weatherDisplay.innerHTML = '<div class="weather-loading">Loading weather data...</div>';
      
      try {
          // First get the forecast endpoint
          const pointsResponse = await fetch(`https://api.weather.gov/points/${lat},${lon}`);
          if (!pointsResponse.ok) throw new Error('Location data unavailable');
          
          const pointsData = await pointsResponse.json();
          const forecastUrl = pointsData.properties.forecast;
          
          // Then get the actual forecast
          const forecastResponse = await fetch(forecastUrl);
          if (!forecastResponse.ok) throw new Error('Forecast data unavailable');
          
          const forecastData = await forecastResponse.json();
          displayWeather(forecastData, locationName);
      } catch (error) {
          showWeatherError(`Weather service unavailable. Try again later.`);
          console.error('Weather API Error:', error);
      }
  }

  function displayWeather(data, locationName) {
      // NOAA provides weather in periods (today, tonight, tomorrow, etc.)
      const currentWeather = data.properties.periods[0];
      
      weatherDisplay.innerHTML = `
          <h3>Weather for ${locationName}</h3>
          <div class="weather-data">
              <div class="weather-main">
                  <span class="temp">${currentWeather.temperature}°${currentWeather.temperatureUnit}</span>
              </div>
              <div class="weather-details">
                  <p><strong>Conditions:</strong> ${currentWeather.shortForecast}</p>
                  <p><strong>Wind:</strong> ${currentWeather.windSpeed}</p>
                  <p><strong>Details:</strong> ${currentWeather.detailedForecast}</p>
              </div>
          </div>
          <div class="weather-recommendations">
              <h4>Recommended Attire:</h4>
              <p>${getWeatherRecommendations(currentWeather)}</p>
          </div>
      `;
  }

  function getWeatherRecommendations(weather) {
      const temp = weather.temperature;
      const forecast = weather.shortForecast.toLowerCase();
      let recommendations = [];
      
      if (temp < 40) {
          recommendations.push('Wear warm layers including a heavy jacket, gloves, and hat');
      } else if (temp < 60) {
          recommendations.push('Wear a jacket or sweater');
      } else if (temp > 80) {
          recommendations.push('Wear light clothing and sunscreen');
      }
      
      if (forecast.includes('rain') || forecast.includes('shower')) {
          recommendations.push('Bring waterproof clothing and boots');
      } else if (forecast.includes('snow')) {
          recommendations.push('Wear waterproof boots and warm layers');
      } else if (forecast.includes('sunny') || forecast.includes('clear')) {
          recommendations.push('Sunglasses recommended');
      }
      
      return recommendations.length > 0 
          ? recommendations.join('. ') + '.' 
          : 'Standard work clothes are appropriate. Wear comfortable shoes.';
  }

  function showWeatherError(message) {
      weatherDisplay.innerHTML = `
          <div class="weather-error">
              <p>${message}</p>
              <p>Please try again later.</p>
          </div>
      `;
  }
});


