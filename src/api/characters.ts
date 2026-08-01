import apiClient from "./apiClient";

async function requestCharacter(request: string) {
  try {
    const response = await apiClient(
      `/character?name=${encodeURIComponent(request)}`,
    );
    return response;
  } catch (error) {
    console.log(error);
  }
}

export default requestCharacter;
