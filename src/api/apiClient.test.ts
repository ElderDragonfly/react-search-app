import {afterEach, describe, expect, it, vi } from "vitest";
import fetchResults from "./apiClient";
export type SearchType = "characters" | "locations" | "episodes";

describe(fetchResults, () => {
  // После it восстанавливает исходную функцию fetch
  afterEach(() => {
  vi.unstubAllGlobals();
  });
  const searchTypes: SearchType[] = [
    "characters",
    "episodes",
    "locations",
  ];
  // Возвращаемые данные для всех searchType
  const data = {
    characters:  {
        info: {
          count: 1,
          pages: 1,
          next: null,
          prev: null,
        },
        results: [{
          id: 2,
          name: "Morty Smith",
          status: "Alive",
          species: "Human",
          type: "",
          gender: "Male",
          origin: {
            name: "Earth",
            url: "https://rickandmortyapi.com/api/location/1"
          },
          location: {
            name: "Earth",
            url: "https://rickandmortyapi.com/api/location/20"
          },
          image: "https://rickandmortyapi.com/api/character/avatar/2.jpeg",
          episode: [
            "https://rickandmortyapi.com/api/episode/1",
            "https://rickandmortyapi.com/api/episode/2",
          ],
          url: "https://rickandmortyapi.com/api/character/2",
          created: "2017-11-04T18:50:21.651Z"}],
      },
    episodes: {
        info: {
          count: 1,
          pages: 1,
          next: null,
          prev: null,
        },
        results: [{ 
          id: 28, 
          name: "The Ricklantis Mixup", 
          air_date: "September 10, 2017" ,
          episode: "S03E07",
          characters: [
            "https://rickandmortyapi.com/api/character/1",
            "https://rickandmortyapi.com/api/character/2"
          ],
          url: "https://rickandmortyapi.com/api/episode/28",
          created: "2017-11-10T12:56:36.618Z"
        }],
      },
    locations: {
      info: {            
        count: 1,
        pages: 1,
        next: null,
        prev: null,
      },
      results: [{
      id: 3,
      name: "Citadel of Ricks",
      type: "Space station",
      dimension: "unknown",
      residents: [
        "https://rickandmortyapi.com/api/character/8",
        "https://rickandmortyapi.com/api/character/14",
      ],
      url: "https://rickandmortyapi.com/api/location/3",
      created: "2017-11-10T13:08:13.191Z"
    }]}
  }
  it.each(searchTypes)("requests %s by name and returns the results", async (searchType) => {
    const fetchPath = {
      characters: "https://rickandmortyapi.com/api/character?name=Morty+Smith&page=1",
      episodes: "https://rickandmortyapi.com/api/episode?name=The+Ricklantis+Mixup&page=1",
      locations: "https://rickandmortyapi.com/api/location?name=Citadel+of+Ricks&page=1"
    }
    // Создаём данные которые нам "вернёт" фэйковый fetch в зависимости от searchType
    const apiData = data[searchType]
      const fakeFetch = vi.fn(async () => {
        return {
          ok: true,
          json: async () => {
            return apiData;
          },
        };
      });
      // Заменяем настоящий fetch фэйковым
      vi.stubGlobal("fetch", fakeFetch);
      // Ожидаем фэйковый Promise в зависимости от SearchType
      const resultData = await fetchResults(searchType, data[searchType].results[0].name);
      expect(resultData).toEqual(apiData);
      // Ожидаем что заменённый fetch вызовется только один раз 
      expect(fakeFetch).toHaveBeenCalledTimes(1);
      // Смотрим что request отправил в fetch в зависимости от searchType
      expect(fakeFetch).toHaveBeenCalledWith(fetchPath[searchType]);
  });
});
