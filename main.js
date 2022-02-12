import ApiKeys from "./keys.js";

document.addEventListener("DOMContentLoaded", () => {

    var map = L.map('map').setView([52.1009, 5.6463], 8);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
    }).addTo(map);

    L.marker([52.1009, 5.6463]).addTo(map)
        .bindPopup('Een popup in het<br>midden van Nederland!')
        .openPopup();
});
