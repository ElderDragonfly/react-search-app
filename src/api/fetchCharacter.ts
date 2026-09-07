// import { fetchResults } from "./apiClient";

export type CharacterFilter = {
  name: string;
  status: "alive" | "dead" | "unknown";
  species: string;
  type: string;
  gender: "female" | "male" | "genderless" | "unknown";
};

// function fetchCharacter(query: string | number | number[], page: number = 1) {
//   return fetchResults("characters", query, page);
// }

// export default fetchCharacter;
