import { ApiError } from "./errors/ApiError";
import type { SearchType } from "../components/types/types";

const BASE_URL = "https://rickandmortyapi.com/api";

function request(path: string) {
  return fetch(BASE_URL + path).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      const error = new ApiError(response.status, response.statusText);
      throw error;
    }
  });
}

export async function fetchResults(searchType: SearchType, query: string | number | number[], page: number = 1) {
  // Приводим searchType к тому, чтобы использовать в URL запроса
  const searchTypePath = searchType.slice(0, -1);
  // Если введённые данные это строка
  if(typeof(query) === 'string') {
// Проверяем ввод на то что это название searchType и тогда ищем searchType по названию
  const containsLetters = /[a-zA-Z]/.test(query);
  if (containsLetters) {
    try {
      const response = await request(
        `/${searchTypePath}?name=${encodeURIComponent(query)}&page=${page}`,
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
      const response = await request(`/${searchTypePath}/${encodeURIComponent(query)}`);
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
      const response = await request(`/${searchTypePath}/${ids.join(",")}`);
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
      const response = await request(`/${searchTypePath}?page=${page}`);
      return response;
    } catch (error) {
      console.log(error);
    }
  }
  }
  // Если введённые данные число или массив чисел
  else if (typeof(query) === 'number' || Array.isArray(query) && query.every(item => typeof item === 'number' && !isNaN(item))) {
    try {
      const response = await request(`/${searchTypePath}/${query}`);
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
  
}

export default fetchResults;
