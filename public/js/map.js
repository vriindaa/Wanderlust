mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'map', // container ID
center: coordinates, // starting position [New Delhi and coordinates - [east,north]]
zoom: 9 // starting zoom
});

// Create a default Marker and add it to the map.
const marker = new mapboxgl.Marker({color:"red"})
.setLngLat(coordinates) //will shift from show.ejs
.setPopup(new mapboxgl.Popup({offset: 25})
.setHTML("<p>Exact location will be provided after booking</p>"))
.addTo(map);