let currentTimeZoneContainer = document.querySelector(".current-time-zone-container");
let currentLatitude;
let currentLongitude;

// Imediate Invoked function expression to fetch current longitude and latitude of user when open a web page
(function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("Geolocation is not supported by this browser.");
        document.querySelector(".current-time-data-container").innerHTML = `<p id="address-warning">Geolocation is not supported by this browser.</p>`
    }
})();

function showPosition(position) {
    currentLatitude = position.coords.latitude;
    currentLongitude = position.coords.longitude;
    fetchLocation(currentLatitude, currentLongitude)
}

// Function to fetch location object using longitude and latitude
function fetchLocation(latitude, longitude) {
    fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=a02e426696d7436788442716c690df3c`)
        .then(resp => resp.json())
        .then((result) => {
            renderCurrentData(result.results[0]);
        });
}

// Function to render location data on screen
function renderCurrentData(locationObject) {
    // console.log(locationObject)
    currentTimeZoneContainer.children[1].innerHTML = `
    <p>Name Of Time Zone : ${locationObject.timezone.name}</p>
    <div class="coordinates-container">
        <p>Lat : ${locationObject.lat}</p>
        <p>Long : ${locationObject.lon}</p>
    </div>
    <p>Offset STD : ${locationObject.timezone.offset_STD}</p>
    <p>Offset STD Seconds : ${locationObject.timezone.offset_STD_seconds}</p>
    <p>Offset DST : ${locationObject.timezone.offset_DST}</p>
    <p>Offset DST Seconds: ${locationObject.timezone.offset_DST_seconds}</p>
    <p>Country : ${locationObject.country}</p>
    <p>Postcode : ${locationObject.postcode}</p>
    <p>City : ${locationObject.city}</p>`
}

// Now we will render coordinates found with the help of provided address
// Fetching location with the help of address
function fetchLocationByAddress() {
    let address = `${document.getElementById("inbut-box").value}`;
    if (address) {
        fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=d1427a43413e4316babaa244c629cc81`)
            .then(resp => resp.json())
            .then((geocodingResult) => {
                // console.log(geocodingResult.features[0]);
                // console.log(typeof geocodingResult.features[0])   //Object
                renderEnteredAddress(geocodingResult.features[0])
            });
    }
}

// Function to print location data on screen with filtering it with given user address
function renderEnteredAddress(addressObject) {
    if (addressObject) {
        let fetchDataContainer = document.getElementById("fetc-data-container");
        fetchDataContainer.innerHTML = '';
        fetchDataContainer.innerHTML = `
        <h1>Your result</h1>
                <div class="fetch-time-data-container">
                    <p>Name Of Time Zone : ${addressObject.properties.timezone.name}</p>
                    <div class="coordinates-container">
                        <p>Lat : ${addressObject.properties.lat}</p>
                        <p>Long : ${addressObject.properties.lon}</p>
                    </div>
                    <p>Offset STD : ${addressObject.properties.timezone.offset_STD}</p>
                    <p>Offset STD Seconds : ${addressObject.properties.timezone.offset_DST_seconds}</p>
                    <p>Offset DST : ${addressObject.properties.timezone.offset_DST}</p>
                    <p>Offset DST Seconds : ${addressObject.properties.timezone.offset_DST_seconds}</p>
                    <p>Country : ${addressObject.properties.country}</p>
                    <p>Postcode : ${addressObject.properties.postcode}</p>
                    <p>City : ${addressObject.properties.city}</p>
                </div>`
    }
    else {
        let fetchDataContainer = document.getElementById("fetc-data-container");
        fetchDataContainer.innerHTML = '<p id="address-warning">Timezone could not be found!</p>';
    }
}