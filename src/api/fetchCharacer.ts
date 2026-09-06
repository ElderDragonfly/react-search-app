import { request } from "./apiClient";

async function fetchCharacter(query: string, page: number = 1) {// Если введённые данные это строка
  if(typeof(query) === 'string') {
// Проверяем ввод на то что это название searchType и тогда ищем searchType по названию
  const containsLetters = /[a-zA-Z]/.test(query);
  if (containsLetters) {
    try {
      const response = await request(
        `/character?name=${encodeURIComponent(query)}&page=${page}`,
      );
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  // Проверяем ввод на то что это id searchType и тогда ищем searchType по id
  const containsOnlyDigits = /^\d+$/.test(query);
  if (containsOnlyDigits) {
    try {
      const response = await request(`/character/${encodeURIComponent(query)}`);
      return {
        info: {
          count: 1,
          pages: 1,
          next: null,
          prev: null,
        },
        results: Array.isArray(response) ? response : [response],
      };
    } catch (error) {
      console.log(error);
    }
  }

  // Проверяем ввод на то что это несколько id searchType и тогда ищем все нужные searchType по id
  const parts = query.trim().split(/[,\s]+/);
  const containsOnlyIds =
    query.trim() !== "" && parts.every((part) => /^\d+$/.test(part));
  const ids = parts.map(Number);
  if (containsOnlyIds) {
    try {
      const response = await request(`/character/${ids.join(",")}`);
      const results = Array.isArray(response) ? response : [response];
      return {
        info: {
          count: results.length,
          pages: 1,
          next: null,
          prev: null,
        },
        results: results,
      };
    } catch (error) {
      console.log(error);
    }
  }

  // Проверяем ввод на то что там пустая строка
  if (!query.trim()) {
    try {
      const response = await request(`/character?page=${page}`);
      return response;
    } catch (error) {
      console.log(error);
    }
  }
  }}

  export default fetchCharacter;