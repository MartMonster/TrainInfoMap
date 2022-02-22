import apiCall from "./calls.js"

export default class Trains {
    /**
     * 
     * @param {number} lat 
     * @param {number} lng 
     * @param {int} raduis 
     * @param {int} limit 
     * @param {string} features 
     * @returns {Promise<object>}
     */
    static async getVehicles() {
        const apiResponse = await apiCall(`virtual-train-api/api/vehicle`, "GET");

        if(!apiResponse.ok) throw new Error(await apiResponse.text());
        return await apiResponse.json();
    }

    static async getStopsForTrain(id) {
        const apiResponse = await apiCall(`reisinformatie-api/api/v2/journey?train=${id}`, "GET");

        if (!apiResponse.ok) throw new Error(await apiResponse.text());
        return await apiResponse.json();
    }

    static async getNearestVehicles(lat, lng, radius) {
        const apiResponse = await apiCall(`virtual-train-api/api/vehicle?lat=${lat}&lng=${lng}&radius=${radius}`, "GET");

        if (!apiResponse.ok) throw new Error(await apiResponse.text());
        return await apiResponse.json();
    }
}