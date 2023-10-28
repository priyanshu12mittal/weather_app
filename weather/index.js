const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");

const userInfoContainer = document.querySelector(".user-info-container");

let currentTab = userTab;
api_key = "970acc8cf226452e2928c2c71b0f811b";
currentTab.classList.add("current-tab");
getfromSessionStorage();

// one more work 

function switchTab(clickedTab){
    if (clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if (!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            // previously on search tab now your weather page 
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getfromSessionStorage();
        }
    }
}
userTab.addEventListener('click',()=>{
    // pass clciked tab input 
    switchTab(userTab);
})

searchTab.addEventListener('click',()=>{
    // pass clciked tab input 
    switchTab(searchTab);
})

// check current location 
function getfromSessionStorage(){
    const localCoord = sessionStorage.getItem("user-coord");
    if (!localCoord){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coords = JSON.parse(localCoord);
        fetchUserWeatherInfo(coords);
    }
}

async function fetchUserWeatherInfo(coords){
    const {lat, lon} = coords;
    // make grant access visible 
    grantAccessContainer.classList.remove("active");
    // make loader visible
    loadingScreen.classList.add("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        // do something
        loadingScreen.classList.remove("active");
    }
}

function renderWeatherInfo(data){
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-clouds]");

    // fetch values

    cityName.innerText = data?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    desc.innerText = data?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temp.innerText = `${data?.main?.temp} °C`;
    windSpeed.innerText = `${data?.wind?.speed} m/s`;
    humidity.innerText = `${data?.main?.humidity} %`;
    cloudiness.innerText = `${data?.clouds?.all} %`;
}

function getLocation(){
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        console.log("not supported")
    }
}

function showPosition(position){
    const userCoords = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coord",JSON.stringify(userCoords));
    fetchUserWeatherInfo(userCoords);
}
const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener('click',getLocation);


const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    let cityName = searchInput.value;

    if (cityName === ""){
        return;
    }
    else{
        fetchSearchWeatherInfo(cityName);
    }
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){

    }
}