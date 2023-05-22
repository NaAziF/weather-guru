function createComponentsList(response) {
  const components = response.list[0].components;
  const list = document.createElement('ul');

  // Iterate over the components
  for (const component in components) {
    const value = components[component];

    // Create list item (LI) for each component
    const listItem = document.createElement('li');
    listItem.textContent = `${component}: ${value}`;

    // Append the list item to the unordered list
    list.appendChild(listItem);
  }

  // Return the created unordered list
  return list;
}


async function getAirQuality() {
  try {
    // Get user's location
    const position = await getCurrentPosition();

    // Extract latitude and longitude
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    // API key for OpenWeatherMap
    const apiKey = '141094484e25bf2f7582d66324f7258c';

    // Build the API URL
    const apiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    // Fetch the air quality data
    const response = await fetch(apiUrl);
    const data = await response.json();

			//Get the container element where the list will be appended
const container = document.getElementById('air-poll');

// Call the function to create the components list
const componentsList = createComponentsList(data);

// Append the list to the container element
container.appendChild(componentsList);



    // Extract the air quality information
    const airQuality = data.list[0].main.aqi;

    // Output the air quality
    console.log(data);
var aqi=data.list[0].main.aqi;

var aqiPrint="Invalid";
if(aqi==1){
aqiPrint="Good"
}
else if(aqi==2){
aqiPrint="Fair"
}else if (aqi==3){

aqiPrint="Moderate";
}else if(aqi==4){
aqiPrint="Poor"
}else{
aqiPrint="Very Poor"
}
document.getElementById('air-qua').innerHTML=aqiPrint;

// adding data to html
  } catch (error) {
    console.error('Error:', error);
  }
}

// Function to get user's location
function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

// Call the function to get the air quality
getAirQuality();
