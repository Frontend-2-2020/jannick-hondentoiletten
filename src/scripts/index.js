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

// Maken een custom icoon
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

// We halen de data op
let coordinates;
Axios.get("https://datatank.stad.gent/4/infrastructuur/hondenvoorzieningen.geojson")
    .then(response => {
        // const {coordinates} = response.data;
        // const coordinates = response.data.coordinates;

        coordinates = response.data.coordinates;
        coordinates.forEach(coord => {
            const marker = L.marker([coord[1], coord[0]], {icon: myIcon}).addTo(map);
            marker.bindPopup(`<a href='https://www.google.com/maps/search/${coord[1]},${coord[0]}' target="_blank">Google</a>`);
        });

        berekenAfstanden();
    });

// Haal persoons location op
navigator.geolocation.getCurrentPosition(getPositionSucces);

let userPosition;
function getPositionSucces(pos){
    const {latitude, longitude} = pos.coords;

    userPosition = {
        latitude, // latitude: latitude
        longitude, // longitude: longitude
    };

    berekenAfstanden();
}

var betterCoords = [];
function berekenAfstanden(){
    if(coordinates && userPosition){
        console.log(coordinates, userPosition);
        // Bereken afstanden voor elke coordinaat tot persoonslocatie;
        for (let i = 0; i < coordinates.length; i++) {
            const coord = coordinates[i];
            const distance = 10;
            betterCoords.push({
                latitude: coord[0],
                longitude: coord[1],
                distance
            });
        }

        //betterCoords sorteren

        //betterCoords 1ste 5 in lijstje
        //betterCoords 1ste 5 groene marker
        //betterCoords alles behalve 1ste 5 roze marker
    }
};
