import apiCall from "./calls.js"

export default class Trains {
    static async getVehicles(lat, lng, raduis, limit = 15, features = null) {
        const apiResponse = await apiCall(`virtual-train-api/api/vehicle?lat=${lat}&lng=${lng}&radius=${raduis}&limit=${limit}`, "GET");

        if(!apiResponse.ok) throw new Error(await apiResponse.text());
    }
}