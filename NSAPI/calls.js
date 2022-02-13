import ApiKeys from '../keys.js';

export default class Calls {

    /**
     * 
     * @param {number} lat 
     * @param {number} lng 
     * @param {integer} radius 
     * @param {integer} limit 
     * @param {string} features
     */
    static async getVehicles(lat, lng, radius, limit = 15, features) {
        let nsKey = ApiKeys.getNSKey();
        $(function() {
            var params = {
                "lat": `${lat}`,
                "lng": `${lng}`,
                "radius": `${radius}`,
                "limit": `${limit}`,
                //"features": `${features}`
            };
      
            $.ajax({
                url: "https://gateway.apiportal.ns.nl/virtual-train-api/api/vehicle?" + $.param(params),
                beforeSend: function(xhrObj){
                    // Request headers
                    xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key",`${nsKey}`);
                },
                type: "GET",
                // Request body
                data: "{body}",
            })
            .done(function(data) {
                alert("success");
            })
            .fail(function() {
                alert("error");
            });
        });
    }
}