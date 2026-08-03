import apiClient from "./apiClient";

async function fetchCharacters(query: string) {
  try {
    const response = await apiClient(
      `/character?name=${encodeURIComponent(query)}`,
    );
    return response;
  } catch (error) {
    console.log(error);
  }
}

export default fetchCharacters;
