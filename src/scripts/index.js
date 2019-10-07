import L from "leaflet";
import "leaflet/dist/leaflet.css";
import '../styles/index.scss';
import Axios from "axios";

// Kaart aanmaken
var map = L.map('map', {
    center: [51.035133942053, 3.7399235735628],
    zoom: 13
});

// Kaart afbeeldingen toevoegen
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

const myIcon = L.icon({
    iconUrl: 'public/marker.png',
    iconSize: [31, 41],
    iconAnchor: [15, 41],
    popupAnchor: [0, -35],
});

/*
Axios.get("https://datatank.stad.gent/4/infrastructuur/hondenvoorzieningen.geojson")
    .then(function(response){
        var coordinates = response.data.coordinates;
        for (let i = 0; i < coordinates.length; i++) {
            const coord = coordinates[i];
            var marker = L.marker([coord[1], coord[0]], {icon: myIcon}).addTo(map);
            marker.bindPopup(coord[1] + "/" + coord[0]);
        }
    });
*/

Axios.get("https://datatank.stad.gent/4/infrastructuur/hondenvoorzieningen.geojson")
    .then(response => {
        const {coordinates} = response.data;
        coordinates.forEach(coord => {
            const marker = L.marker([coord[1], coord[0]], {icon: myIcon}).addTo(map);
            marker.bindPopup(`<a href='https://www.google.com/maps/search/${coord[1]},${coord[0]}' target="_blank">Google</a>`);
        });
    });