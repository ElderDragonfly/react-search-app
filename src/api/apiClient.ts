import { ApiError } from "./errors/ApiError";

const BASE_URL = "https://rickandmortyapi.com/api";

export function request(path: string) {
  return fetch(BASE_URL + path).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      const error = new ApiError(response.status, response.statusText);
      throw error;
    }
  });
}

export default request;
