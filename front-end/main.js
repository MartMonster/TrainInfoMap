import Trains from "./NSAPI/trains.js";

document.addEventListener("DOMContentLoaded", () => {

    //map initialization
    var map = L.map('map', {attributionControl: false}).setView([52.1009, 5.6463], 8);

    $.getJSON("spoorkaart/spoorkaart.json", function(data) {
        L.geoJSON(data.payload.features).addTo(map);
    });

    $.getJSON("stations/stations.json", function(data) {
        console.log(data);
        let stationIcon = L.icon({
            iconUrl: "img/train-station.png",
            shadowUrl: "img/train-station-shadow.png",

            iconSize: [25,25],
            shadowSize: [25,25],
            iconAnchor: [12.5,25],
            shadowAnchor: [12.5,25],
            popupAnchor: [0,0]
        });

        data.payload.forEach(function(station) {
            if ((station.stationType === "KNOOPPUNT_INTERCITY_STATION" || station.stationType === "MEGA_STATION") && station.land === "NL") {
                L.marker([station.lat, station.lng], {icon: stationIcon}).addTo(map);
            }
        })
    })

    let trainIcon = L.icon({
        iconUrl: "img/train-ns.png",
        shadowUrl: "img/train-shadow.png",

        iconSize: [30,30],
        shadowSize: [30,30],
        iconAnchor: [15,30],
        shadowAnchor: [15,30],
        popupAnchor: [0,-25]
    });

    let minorStationIcon = L.icon({
        iconUrl: "img/minor-train-station.png",
        shadowUrl: "img/minor-train-station.png",

        iconSize: [15,15],
        shadowSize: [15,15],
        iconAnchor: [7.5,7.5],
        shadowAnchor: [7.5,7.5],
        popupAnchor: [0,0]
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

    let trainStops = new Array();
    function onClick() {
        console.log(this.options.title);
        Trains.getStopsForTrain(this.options.title).then(function(result) {
            console.log(result);
            result.payload.stops.forEach(function(stop) {
                console.log("type:" + stop.locationType);
                if((stop.status === "ORIGIN" || stop.status === "STOP" || stop.status === "DESTINATION")) {
                    trainStops.push(L.marker([stop.stop.lat, stop.stop.lng], {icon: minorStationIcon}).addTo(map));
                }
            })
        });
        //alle markers langs het traject moeten verschijnen
    }

    function onClose() {
        trainStops.forEach((stop) => {
            map.removeLayer(stop);
        })
        trainStops = new Array();
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
                L.marker([trein.lat, trein.lng], {title: `${trein.ritId}`/* , speed: trein.snelheid, direction: richting */, icon: trainIcon})
                    .addTo(map).on('click', onClick)
                    .bindPopup(`Trein ID: ${trein.ritId}`)
                    .getPopup().on('remove', onClose);
            })
        });
    } catch(e) {
        alert("query didn't come back OK:\n"+e);
    }
});
