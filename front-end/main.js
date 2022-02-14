import Trains from "./NSAPI/trains.js";

document.addEventListener("DOMContentLoaded", () => {

    var map = L.map('map').setView([52.1009, 5.6463], 8);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
        maxZoom: 19,
        minZoom: 6,
    }).addTo(map);

    var location = L.control.locate({
        flyTo: true,
        clickBehavior: {
            inView: 'setView'
        },
        locateOptions: {
            enableHighAccuracy: true
        }
    }).addTo(map);

    location.start();

    L.marker([52.1009, 5.6463]).addTo(map)
        .bindPopup('Een popup in het<br>midden van Nederland!')
        .openPopup();

    try {
        Trains.getVehicles(53.2113, 6.5658, 1000);
    } catch(e) {
        alert("query didn't come back OK:\n"+e);
    }
});
