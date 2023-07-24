fetch('https://api.geoapify.com/v1/ipinfo?apiKey=3a1be8a602e141c4bd7ad01b6431cb92')
    .then(response => response.json())
    .then(data => {
        // You can now access the location data in the "data" object
        console.log(data.country.iso_code);
    })