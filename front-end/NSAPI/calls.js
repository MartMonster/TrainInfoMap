/**
 * Makes an API call to the given URL with the stored server preference
 * @param {string} url 
 * @param {string} method
 * @param {object} data
 * @returns {Promise<object>}
 */
export default async function apiCall(url = "virtual-train-api/api/vehicle?", method = "GET", data = null, accept = "application/json") {

    let nsKey;

    await $.getJSON("keys.json", function(data) {
        nsKey = data.keys[0].key;
    });

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
        method: method,
        headers: requestConfig.headers,
        body: requestConfig.body
    });
}