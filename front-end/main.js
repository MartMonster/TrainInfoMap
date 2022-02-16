import Trains from "./NSAPI/trains.js";

document.addEventListener("DOMContentLoaded", () => {

    //map initialization
    var map = L.map('map').setView([52.1009, 5.6463], 8);

    $.getJSON("spoorkaart/spoorkaart.json", function(data) {
        L.geoJSON(data.payload.features).addTo(map);
    });

    $.getJSON("stations/stations.json", function(data) {
        console.log(data);
        let stationIcon = L.icon({
            iconUrl: "img/train-station.png",
            shadowUrl: "img/train-station-shadow.png",

            iconSize: [30,30],
            shadowSize: [30,30],
            iconAnchor: [15,30],
            shadowAnchor: [15,30],
            popupAnchor: [0,0]
        });
        L.marker([52.1009, 5.6463], {icon: stationIcon}).addTo(map);
        data.payload.forEach(function(station) {
            if (station.stationType === "KNOOPPUNT_INTERCITY_STATION") {
                L.marker([station.lat, station.lng], {icon: stationIcon}).addTo(map);
            }
        })
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
        maxZoom: 19,
        minZoom: 6,
    }).addTo(map);

    if(!navigator.geolocation) {
        console.log("Your browser doesn't support geolocation")
    } else {
        setInterval(() => {
            navigator.geolocation.getCurrentPosition(getPosition)
        }, 5000);
    }

    function getPosition(position){
        //console.log(position)
        var lat = position.coords.latitude
        var long = position.coords.longitude
        //var accuracy = position.coords.accuracy

        console.log("Your location is: ", lat, ", "+ long)
    }

    /*L.marker([52.1009, 5.6463]).addTo(map)
        .bindPopup('Een popup in het<br>midden van Nederland!')
        .openPopup();
    */

    try {
        Trains.getVehicles(53.2113, 6.5658, 1000).then(function(result) {
            console.log(result);
            result.payload.treinen.forEach(function(trein) {
                L.marker([trein.lat, trein.lng]).addTo(map);
            })
        });
    } catch(e) {
        alert("query didn't come back OK:\n"+e);
    }
});
