import Trains from "./NSAPI/trains.js";

document.addEventListener("DOMContentLoaded", () => {

    var map = L.map('map').setView([52.1009, 5.6463], 8);

    $.getJSON("spoorkaart/spoorkaart.json", function(data) {
        L.geoJSON(data.payload.features).addTo(map);
    });

    $.getJSON("stations/stations.json", function(data) {
        console.log(data);
        let stationIcon = L.icon({
            iconUrl: "img/train-station",
            shadowUrl: "img/train-station-shadow",

            iconSize: [512,512],
            shadowSize: [512,512],
            iconAnchor: [256,0],
            shadowAnchor: [256,0],
            popupAnchor: [0,0]
        });
        L.marker([52.1009, 5.6463], {icon: stationIcon}).addTo(map);
        // data.forEach(function(station) {
        //     L.marker([station.lat, station.lng], {icon: stationIcon}).addTo(map);
        // })
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
        maxZoom: 19,
        minZoom: 6,
    }).addTo(map);

    // var location = L.control.locate({
    //     flyTo: true,
    //     clickBehavior: {
    //         inView: 'setView'
    //     },
    //     locateOptions: {
    //         enableHighAccuracy: true
    //     }
    // }).addTo(map);

    // location.start();

    // L.marker([52.1009, 5.6463]).addTo(map)
    //     .bindPopup('Een popup in het<br>midden van Nederland!')
    //     .openPopup();

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
