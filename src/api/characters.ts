import apiClient from "./apiClient";

async function fetchCharacters(query: string, page: number) {
  try {
    const response = await apiClient(
      `/character?name=${encodeURIComponent(query)}&page=${page}`,
    );
    return response;
  } catch (error) {
    console.log(error);
  }
}

export default fetchCharacters;
