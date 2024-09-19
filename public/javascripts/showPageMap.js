let map;
let directionsService;
let directionsRenderer;
let start;
let end;

function initMap() {
    // Initialize map with default center and zoom level
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 0, lng: 0 }, // neutral starting point (equator)
        zoom: 2, // Zoomed out to show the whole world initially
        mapTypeId: google.maps.MapTypeId.ROADMAP, // Default map type
        streetViewControl: false, // Disable the Pegman (Street View) control
        fullscreenControl: false, // Optional: Disable the fullscreen control
        mapTypeControl: false, // Optional:
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    // Try HTML5 geolocation to center the map on the user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Set the user's location to the global `start` variable
                start = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                // Set the `end` destination using neighborhood geometry coordinates
                // Assuming the neighborhood.geometry.coordinates is [lng, lat]
                end = {
                    lat: neighborhood.geometry.coordinates[1],
                    lng: neighborhood.geometry.coordinates[0],
                };

                // Automatically calculate and display the route (default: DRIVING)
                calculateAndDisplayRoute('WALKING');
            },
            () => {
                handleLocationError(true, map.getCenter());
            }
        );
    } else {
        // Handle the error when geolocation is not supported
        handleLocationError(false, map.getCenter());
    }
}

// Function to calculate and display the route
function calculateAndDisplayRoute(travelMode) {
    if (!start || !end) {
        console.error('Start or end locations are not defined');
        return;
    }

    directionsService.route(
        {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode[travelMode],
        },
        (response, status) => {
            if (status === 'OK') {
                directionsRenderer.setDirections(response);

                const route = response.routes[0];
                const leg = route.legs[0];

                new google.maps.Marker({
                    position: leg.start_location,
                    map: map,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE, 
                        scale: 10, 
                        fillColor: '#4285F4', 
                        fillOpacity: 1,
                        strokeWeight: 2, 
                        strokeColor: '#ffffff'
                    }
                });

                new google.maps.Marker({
                    position: leg.end_location,
                    map: map,
                    icon: {
                        url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" // Custom icon for the end
                    }
                });

                directionsRenderer.setOptions({ suppressMarkers: true });


                const directionInfo = document.getElementById('directions')
                directionInfo.innerHTML = `
                    <p><strong>Distance:</strong> ${leg.distance.text}</p>
                    <p><strong>Duration:</strong> ${leg.duration.text}</p>
                `

            } else {
                console.error(`Directions request failed due to ${status}`);
            }
        }
    );
}

// Button event listeners for different travel modes
document.getElementById('walking').addEventListener('click', () => {
    calculateAndDisplayRoute('WALKING');
});
document.getElementById('driving').addEventListener('click', () => {
    calculateAndDisplayRoute('DRIVING');
});

// my buttons to allow users to switch between maps.
document.getElementById('roadmap').addEventListener('click', () =>{
    map.setMapTypeId(google.maps.MapTypeId.ROADMAP)
} ) 

document.getElementById('hybrid').addEventListener('click', () =>{
    map.setMapTypeId(google.maps.MapTypeId.HYBRID)
}) 


// Handle location errors
function handleLocationError(browserHasGeolocation, pos) {
    console.error(
        browserHasGeolocation
            ? 'Error: The Geolocation service failed.'
            : "Error: Your browser doesn't support geolocation."
    );
}
