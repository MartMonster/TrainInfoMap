import ApiKeys from '../keys.js';

export class Calls {

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
                    xhrObj.setRequestHeader("Access-Control-Allow-Origin", "*");
                },
                type: "GET",
                // Request body
                data: "{body}",
            })
            .done(function(data) {
                console.log(data);
                alert("success");
            })
            .fail(function() {
                alert("error");
            });
        });
    }
}

/**
 * Makes an API call to the given URL with the stored server preference
 * @param {string} url 
 * @param {string} method
 * @param {object} data
 * @returns {Promise<Response>}
 */
export default async function apiCall(url = "virtual-train-api/api/vehicle?", method = "GET", data = null, accept = "application/json") {
    // We obtain the server preference from the state storage (implemented using
    // localstorage APIs in this case)
    //const server = serverPreference.getSelectedServer();
    const server = "localhost:80";
    if (server == null)
        throw new Error("No server preference set!");

    // Construct URL
    url = `http://${server}/${url}`;

    let nsKey = ApiKeys.getNSKey();

    let httpHeaders = {
        "Ocp-Apim-Subscription-Key": nsKey,
        "Content-Type": "application/json",
        "Accept": accept,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type"
    }

    /** @type {HeadersInit} */
    const requestHeaders = new Headers(httpHeaders);

    // Set options
    /** @type {RequestInit} */
    const requestConfig = {
        method: method,
        headers: {
            "Ocp-Apim-Subscription-Key": nsKey,
            "Content-Type": "application/json",
            "Accept": accept,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, GET, PUT, DELETE",
            "Access-Control-Allow-Headers": "Content-Type"
        }
    };

    // Set data: in this case we want to send the request data as
    // URL parameters for GET/HEAD/DELETE requests and only as request body
    // for other requests. This is possible since our specification is compatible
    // with this assumption. Other APIs might actually need both body and URL
    // parameters.
    if (data != null) {
        if (method === "GET" || method === "HEAD" || method === "DELETE") {
            // Use as parameter data
            url += "?" + new URLSearchParams(data).toString();
        } else {
            // Use as body data
            requestConfig.body = JSON.stringify(data);
        }
    }

    // Await the result: any errors will the thrown
    return await fetch(url, {
        method: "GET",
        headers: requestHeaders,
        body: requestConfig.body
    });
}