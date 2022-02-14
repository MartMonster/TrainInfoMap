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
    static async getVehicles(lat, lng, raduis, limit = 15, features = null) {
        const apiResponse = await apiCall(`virtual-train-api/api/vehicle`, "GET");

        if(!apiResponse.ok) throw new Error(await apiResponse.text());
        return await apiResponse.json();
    }
}