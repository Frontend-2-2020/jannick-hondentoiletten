import L from "leaflet";
import "leaflet/dist/leaflet.css";
import '../styles/index.scss';
import Axios from "axios";
import { getDistance } from 'geolib';
import "bootstrap/dist/css/bootstrap.min.css";

// Kaart aanmaken
var map = L.map('map', {
    center: [51.035133942053, 3.7399235735628],
    zoom: 13
});

// Kaart afbeeldingen toevoegen
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Maken een custom icoon
const greenIcon = L.icon({
    iconUrl: 'public/marker_green.png',
    iconSize: [31, 41],
    iconAnchor: [15, 41],
    popupAnchor: [0, -35],
});

const pinkIcon = L.icon({
    iconUrl: 'public/marker_pink.png',
    iconSize: [31, 41],
    iconAnchor: [15, 41],
    popupAnchor: [0, -35],
});

const orangeIcon = L.icon({
    iconUrl: 'public/marker_orange.png',
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
            
            //marker.bindPopup(`<a href='https://www.google.com/maps/search/${coord[1]},${coord[0]}' target="_blank">Google</a>`);
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
var markers = [];
function berekenAfstanden(){
    if(coordinates && userPosition){
        console.log(coordinates, userPosition);
        // Bereken afstanden voor elke coordinaat tot persoonslocatie;
        for (let i = 0; i < coordinates.length; i++) {
            const coord = coordinates[i];

            // const distance = getDistance({
            //     latitude: coord[1],
            //     longitude: coord[0],
            // }, userPosition);

            const distance = getDistance(coord, userPosition);

            betterCoords.push({
                latitude: coord[1],
                longitude: coord[0],
                distance
            });
        }

        //betterCoords sorteren
        betterCoords.sort((a,b) => {
            if(a.distance > b.distance){
                return 1;
            }

            if(a.distance < b.distance){
                return -1;
            }

            return 0;
        });

        console.log(betterCoords);

        //betterCoords 1ste 5 in lijstje 
        for (let i = 0; i < 5; i++) {
            const element = betterCoords[i];

            const link = document.createElement("a");
            link.setAttribute("class", "list-group-item list-group-item-action");
            link.setAttribute("href", "#");
            link.setAttribute("data-id", i);
            link.addEventListener("mouseover", changeMarker);
            link.addEventListener("mouseout", changeMarkerBack);
            
            link.innerHTML = `<div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">Toilet ${i+1}</h5>
                <small>${(element.distance / 1000).toFixed(2)}KM</small>
                </div>
                <small>${element.latitude} | ${element.longitude}</small>`;

            document.querySelector(".list-group").appendChild(link);
        }   

        //betterCoords 1ste 5 groene marker
        for (let i = 0; i < 5; i++) {
            const element = betterCoords[i];
            const marker = L.marker([element.latitude, element.longitude], {icon: greenIcon}).addTo(map);
            markers.push(marker);
        }  

        //betterCoords alles behalve 1ste 5 roze marker
        for (let i = 5; i < betterCoords.length; i++) {
            const element = betterCoords[i];
            const marker = L.marker([element.latitude, element.longitude], {icon: pinkIcon}).addTo(map);
            markers.push(marker);
        }  
    }
};

function changeMarker(e){
    const index = parseInt(e.currentTarget.getAttribute("data-id"));
    markers[index].setIcon(orangeIcon);
}

function changeMarkerBack(e){
    const index = parseInt(e.currentTarget.getAttribute("data-id"));
    markers[index].setIcon(greenIcon);
}   