import Trains from "./NSAPI/trains.js";

document.addEventListener("DOMContentLoaded", () => {

    //map initialization
    var map = L.map('map', {attributionControl: false}).setView([52.1009, 5.6463], 8);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
        maxZoom: 19,
        minZoom: 6,
    }).addTo(map);

    let trains = new Array();
    $.getJSON("spoorkaart/spoorkaart.json", function(data) {
        L.geoJSON(data.payload.features).addTo(map);
        updateTrains();
    });

    let trainIcon = L.icon({
        iconUrl: "img/train-ns.png",
        shadowUrl: "img/train-shadow.png",

        iconSize: [30, 30],
        shadowSize: [30, 30],
        iconAnchor: [15, 30],
        shadowAnchor: [15, 30],
        popupAnchor: [0, -25]
    });

    let minorStation = L.icon({
        iconUrl: "img/minor-train-station.png",
        shadowUrl: "img/minor-train-station.png",

        iconSize: [10, 10],
        shadowSize: [10, 10],
        iconAnchor: [5, 5],
        shadowAnchor: [5, 5],
        popupAnchor: [0, -10]
    })

    let knooppuntMinorStationIcon = L.icon({
        iconUrl: "img/minor-train-station.png",
        shadowUrl: "img/minor-train-station.png",

        iconSize: [12.5, 12.5],
        shadowSize: [12.5, 12.5],
        iconAnchor: [6.25, 6.25],
        shadowAnchor: [6.25, 6.25],
        popupAnchor: [0,0]
    })

    let intercityStation = L.icon({
        iconUrl: "img/minor-train-station.png",
        shadowUrl: "img/minor-train-station.png",

        iconSize: [15, 15],
        shadowSize: [15, 15],
        iconAnchor: [7.5, 7.5],
        shadowAnchor: [7.5, 7.5],
        popupAnchor: [0, 0]
    })

    let knooppuntICStation = L.icon({
        iconUrl: "img/train-station.png",
        shadowUrl: "img/train-station-shadow.png",

        iconSize: [25, 25],
        shadowSize: [25, 25],
        iconAnchor: [12.5, 25],
        shadowAnchor: [12.5, 25],
        popupAnchor: [0, 0]
    });

    let megaStation = L.icon({
        iconUrl: "img/train-station.png",
        shadowUrl: "img/train-station-shadow.png",

        iconSize: [30, 30],
        shadowSize: [30, 30],
        iconAnchor: [15, 30],
        shadowAnchor: [15, 30],
        popupAnchor: [0, 0]
    });


    setInterval(updateTrains, 60000);
    let isPopupOpen = false;
    // TODO: actually update the location of the trains instead of replacing the object
    async function updateTrains() {
        if(isPopupOpen) {
            return;
        }
        console.log("querying for trains");
        if (trains.length > 0) {
            trains.forEach((train) => {
                map.removeLayer(train);
            });
            trains = new Array();
        }
        try {
            Trains.getVehicles(53.2113, 6.5658, 1000).then(function (result) {
                console.log("queried trains:");
                console.log(result);
                result.payload.treinen.forEach(function (trein) {
                    trains.push(L.marker([trein.lat, trein.lng], { title: `${trein.ritId}`/* , speed: trein.snelheid, direction: richting */, icon: trainIcon })
                        .addTo(map).on('click', onClick)
                        .bindPopup(`Trein ID: ${trein.ritId}`)
                        .getPopup().on('remove', onClose)._source);
                });
            });
        } catch (e) {
            alert("query didn't come back OK:\n" + e);
        }
    }

    let allStationsRaw;
    let majorStations = new Array();
    $.getJSON("stations/stations.json", function (data) {
        console.log("stations:");
        console.log(data);
        allStationsRaw = data.payload;
        data.payload.forEach(function (station) {
            if ((station.stationType === "KNOOPPUNT_INTERCITY_STATION" || station.stationType === "MEGA_STATION") && station.land === "NL") {
                //L.marker([station.lat, station.lng], { icon: knooppuntICStation }).addTo(map);
                addStationToMap(station, null, majorStations);
            }
        });
    });

    async function addStationToMap(station = null, stop = null, array = null) {
        if (station !== null) {
            var marker = null;
            switch (station.stationType) {
                case "MEGA_STATION": marker = L.marker([station.lat, station.lng], { icon: megaStation }).addTo(map); break;
                case "KNOOPPUNT_INTERCITY_STATION": marker = L.marker([station.lat, station.lng], { icon: knooppuntICStation }).addTo(map); break;
                case "INTERCITY_STATION": marker = L.marker([station.lat, station.lng], { icon: intercityStation }).addTo(map); break;
                case "KNOOPPUNT_SNELTREIN_STATION": marker = L.marker([station.lat, station.lng], { icon: knooppuntMinorStationIcon }).addTo(map); break;
                case "KNOOPPUNT_STOPTREIN_STATION": marker = L.marker([station.lat, station.lng], { icon: knooppuntMinorStationIcon }).addTo(map); break;
                case "SNELTREIN_STATION": marker = L.marker([station.lat, station.lng], { icon: minorStation }).addTo(map); break;
                case "STOPTREIN_STATION": marker = L.marker([station.lat, station.lng], { icon: minorStation }).addTo(map); break;
                default: marker = L.marker([station.lat, station.lng]).addTo(map); console.log("something went wrong: " + station.stationType);
            }
            if (array != null) {
                array.push(marker);
            }
        } else if (stop !== null) {
            allStationsRaw.forEach(function(station) {
                if(station.UICCode === stop.uicCode) {
                    var marker = null;
                    switch (station.stationType) {
                        case "MEGA_STATION": marker = L.marker([station.lat, station.lng], { icon: megaStation }).addTo(map); break;
                        case "KNOOPPUNT_INTERCITY_STATION": marker = L.marker([station.lat, station.lng], { icon: knooppuntICStation }).addTo(map); break;
                        case "INTERCITY_STATION": marker = L.marker([station.lat, station.lng], { icon: intercityStation }).addTo(map); break;
                        case "KNOOPPUNT_SNELTREIN_STATION": marker = L.marker([station.lat, station.lng], { icon: knooppuntMinorStationIcon }).addTo(map); break;
                        case "KNOOPPUNT_STOPTREIN_STATION": marker = L.marker([station.lat, station.lng], { icon: knooppuntMinorStationIcon }).addTo(map); break;
                        case "SNELTREIN_STATION": marker = L.marker([station.lat, station.lng], { icon: minorStation }).addTo(map); break;
                        case "STOPTREIN_STATION": marker = L.marker([station.lat, station.lng], { icon: minorStation }).addTo(map); break;
                        default: marker = L.marker([station.lat, station.lng]).addTo(map); console.log("something went wrong: " + station.stationType);
                    }
                    if (array != null) {
                        array.push(marker);
                    }
                }
            });
        }
    }

    if(!navigator.geolocation) {
        console.log("Your browser doesn't support geolocation")
    } else {
        setInterval(() => {
            navigator.geolocation.getCurrentPosition(getPosition)
        }, 5000);
    }

    let trainStops = new Array();
    function onClick() {
        isPopupOpen = true;
        majorStations.forEach((station) => {
            map.removeLayer(station);
        })
        trains.forEach((train) => {
            if (this.options.title !== train.options.title) {
                map.removeLayer(train);
            }
        })
        console.log(this.options.title);
        Trains.getStopsForTrain(this.options.title).then(function(result) {
            console.log(result);
            result.payload.stops.forEach(function(stop) {
                if((stop.status === "ORIGIN" || stop.status === "STOP" || stop.status === "DESTINATION")) {
                    addStationToMap(null, stop.stop, trainStops);
                }
            })
        });
        //alle markers langs het traject moeten verschijnen
    }

    function onClose() {
        majorStations.forEach((station) => {
            station.addTo(map);
        });
        trains.forEach((train) => {
            if (this._source.options.title !== train.options.title) {
                train.addTo(map);
            }
        });
        trainStops.forEach((stop) => {
            map.removeLayer(stop);
        });
        trainStops = new Array();
        isPopupOpen = false;
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
});
