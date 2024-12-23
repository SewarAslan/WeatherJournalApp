// OpenWeatherMap API configuration
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
const apiKey = 'e062e857e680c88d853019cc71231999'; // Replace with your valid API key

// Function to fetch weather data from the OpenWeatherMap API
async function getWeather(zip, country, apiKey) {
  const url = `${baseUrl}?zip=${zip},${country}&appid=${apiKey}&units=imperial`;
  console.log('Requesting:', url); // Debugging URL
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    const data = await response.json();
    return data; // Return weather data
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    alert('Failed to fetch weather data. Please check your inputs and try again.');
  }
}

// Function to send data to the server
async function postData(url = '', data = {}) {
  console.log('Sending data to server:', data); // Debugging line
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const serverResponse = await response.json();
    console.log('Response from server:', serverResponse); // Debugging line
    return serverResponse;
  } catch (error) {
    console.error('Error posting data:', error.message);
  }
}


// Function to update the UI dynamically
async function updateUI() {
  console.log('updateUI called'); // Debugging line
  try {
    const request = await fetch('/all');
    const allData = await request.json();
    console.log('Data received for UI update:', allData); // Log the data fetched from the server

    // Update the DOM elements
    document.getElementById('date').innerHTML = `Date: ${allData.date}`;
    document.getElementById('temp').innerHTML = `Temperature: ${Math.round(allData.temperature)}°F`;
    document.getElementById('content').innerHTML = `Feeling: ${allData.userResponse}`;
    document.querySelector('.results-section').classList.remove('hidden');

  } catch (error) {
    console.error('Error updating UI:', error.message);
  }
}


document.getElementById('generate').addEventListener('click', async () => {
  console.log('Generate button clicked'); // Debugging line

  // Get user input
  const zip = document.getElementById('zip').value.trim();
  const country = document.getElementById('country').value.trim().toUpperCase();
  const feelings = document.getElementById('feelings').value.trim();

  // Input validation
  if (!zip || !/^\d{5}$/.test(zip)) {
    alert('Please enter a valid 5-digit ZIP Code.');
    return;
  }
  if (!feelings) {
    alert('Please share how you are feeling.');
    return;
  }

  // Fetch weather data
  const weatherData = await getWeather(zip, country, apiKey);
  if (!weatherData || !weatherData.main) {
    console.error('Weather data is undefined. Stopping...');
    return;
  }

  const newDate = new Date().toLocaleDateString();

  // Post data to the server
  await postData('/add', {
    temperature: weatherData.main.temp,
    date: newDate,
    userResponse: feelings,
  });

  console.log('Calling updateUI...'); // Debugging line
  // Update the UI
  updateUI();
});

