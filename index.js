const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');
const gps = document.querySelector('#gps');

async function contactiot(rain) {
    console.log(`iot contacted as rainchance ${rain}`);

let headersList = {
 "Accept": "*/*",
 "Content-Type": "application/json"
}
let number=localStorage.getItem("number");
if(number==null){
alert("no iot devices Configured")
return;
}
let bodyContent = JSON.stringify({
  "to":"trigger@applet.ifttt.com",
  "subject":number,
  "text":`There is ${rain}% chance of rain in your area. IOT based Irrigation has been stopped to save water :-)`,
  "AuthToken":"NjAwNjA1MzQ0N0BuYXppZg=="
  
  
});

let response = await fetch("https://api.techkmr.com/mail/send-mail", { 
  method: "POST",
  body: bodyContent,
  headers: headersList
});

let data = await response.text();
console.log(data);

}
gps.addEventListener('click', () => {

    //const APIKey = '141094484e25bf2f7582d66324f7258c';

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("Geolocation is not supported by this browser.");
        alert("Geolocation is not supported by this browser.");
    }

    function showPosition(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;


        const url2 = `https://api.techkmr.com/weather/gps?latitude=${latitude}&longitude=${longitude}`


        fetch(url2)
            .then(response => response.json())
            .then(json => {

                if (json.cod === '404') {
                    container.style.height = '400px';
                    weatherBox.style.display = 'none';
                    weatherDetails.style.display = 'none';
                    error404.style.display = 'block';
                    error404.classList.add('fadeIn');
                    return;
                }

                error404.style.display = 'none';
                error404.classList.remove('fadeIn');

                const image = document.querySelector('.weather-box img');
                const temperature = document.querySelector('.weather-box .temperature');
                const description = document.querySelector('.weather-box .description');
                const humidity = document.querySelector('.weather-details .humidity span');
                const wind = document.querySelector('.weather-details .wind span');

                switch (json.weather[0].main) {
                    case 'Clear':
                        image.src = 'images/clear.png';
                        break;

                    case 'Rain':
                        image.src = 'images/rain.png';
                        break;

                    case 'Snow':
                        image.src = 'images/snow.png';
                        break;

                    case 'Clouds':
                        image.src = 'images/cloud.png';
                        break;

                    case 'Haze':
                        image.src = 'images/mist.png';
                        break;

                    default:
                        image.src = '';
                }

                temperature.innerHTML = `${parseInt(json.main.temp - 273.15)}<span>°C</span>`;
                description.innerHTML = `${json.weather[0].description}`;
                humidity.innerHTML = `${json.main.humidity}%`;
                wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;

                // Calculate the chance of rain in percentage

                const weather = json.weather[0].main;
                const humidity2 = json.main.humidity;
                const pressure = json.main.pressure;
                const clouds = json.clouds.all;
                let rainChance = 0;
                if (weather === "Rain") {
                    rainChance = 90; // High chance of rain if it's already raining
                } else if (weather === "Drizzle" || weather=="Snow"|| weather === "Thunderstorm") {
                    rainChance = 60; // Moderate chance of rain if it's drizzling or thundering
                } else if (weather === "Clouds" && clouds >= 75) {
                    rainChance = 40; // Moderate chance of rain if it's mostly cloudy
                } else if (humidity2 >= 80 && pressure >= 1000 && clouds >= 50) {
                    rainChance = 30; // Low chance of rain if it's humid, with moderate pressure and some clouds
                } else {
                    rainChance = 10; // Very low chance of rain otherwise
                }

                if (rainChance > 59) {
                    contactiot(rainChance);
                } else {
                    console.log(`iot Devices not updates ${rainChance}` )
                }

                weatherBox.style.display = '';
                weatherDetails.style.display = '';
                weatherBox.classList.add('fadeIn');
                weatherDetails.classList.add('fadeIn');
                container.style.height = '590px';

                ////////
            })
    }

})
search.addEventListener('click', () => {

    const APIKey = '141094484e25bf2f7582d66324f7258c';
    const city = document.querySelector('.search-box input').value;

    if (city === '')
        return;

    fetch(`https://api.techkmr.com/weather/city?city=${city}`)
        .then(response => response.json())
        .then(json => {

            if (json.cod=== '404') {
                container.style.height = '400px';
                weatherBox.style.display = 'none';
                weatherDetails.style.display = 'none';
                error404.style.display = 'block';
                error404.classList.add('fadeIn');
                return;
            }

            error404.style.display = 'none';
            error404.classList.remove('fadeIn');

            const image = document.querySelector('.weather-box img');
            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const humidity = document.querySelector('.weather-details .humidity span');
            const wind = document.querySelector('.weather-details .wind span');

            switch (json.weather[0].main) {
                case 'Clear':
                    image.src = 'images/clear.png';
                    break;

                case 'Rain':
                    image.src = 'images/rain.png';
                    break;

                case 'Snow':
                    image.src = 'images/snow.png';
                    break;

                case 'Clouds':
                    image.src = 'images/cloud.png';
                    break;

                case 'Haze':
                    image.src = 'images/mist.png';
                    break;

                default:
                    image.src = '';
            }

            temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
            description.innerHTML = `${json.weather[0].description}`;
            humidity.innerHTML = `${json.main.humidity}%`;
            wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;

            // Calculate the chance of rain in percentage

            const weather = json.weather[0].main;
            const humidity2 = json.main.humidity;
            const pressure = json.main.pressure;
            const clouds = json.clouds.all;
            let rainChance = 0;
            if (weather === "Rain") {
                rainChance = 90; // High chance of rain if it's already raining
            } else if (weather === "Drizzle" ||  weather=="Snow" || weather === "Thunderstorm") {
                rainChance = 60; // Moderate chance of rain if it's drizzling or thundering
            } else if (weather === "Clouds" && clouds >= 75) {
                rainChance = 40; // Moderate chance of rain if it's mostly cloudy
            } else if (humidity2 >= 80 && pressure >= 1000 && clouds >= 50) {
                rainChance = 30; // Low chance of rain if it's humid, with moderate pressure and some clouds
            } else {
                rainChance = 10; // Very low chance of rain otherwise
            }

            if (rainChance > 59) {
                contactiot(rainChance);
            } else {
                console.log(`iot Devices not updates ${rainChance}`)
            }



            weatherBox.style.display = '';
            weatherDetails.style.display = '';
            weatherBox.classList.add('fadeIn');
            weatherDetails.classList.add('fadeIn');
            container.style.height = '590px';


        });


});
