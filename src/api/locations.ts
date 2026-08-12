import apiClient from "./apiClient";

async function fetchLocations(query: string, page: number) {
    try {
        const response = await apiClient(`/location?name=${encodeURIComponent(query)}&page=${page}`)
        return response
    } catch(error) {
        console.log(error);
    }
}

export default fetchLocations;