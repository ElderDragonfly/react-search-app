import apiClient from "./apiClient";

async function fetchLocations(query: string, page: number) {
  // Проверяем ввод на то что это название локации и тогда ищем локацию по названию
  const containsLetters = /[a-zA-Z]/.test(query);
  if (containsLetters) {
    try {
      const response = await apiClient(
        `/location?name=${encodeURIComponent(query)}&page=${page}`,
      );
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  // Проверяем ввод на то что это id локации и тогда ищем локацию по id
  const containsOnlyDigits = /^\d+$/.test(query);
  if (containsOnlyDigits) {
    try {
      const response = await apiClient(`/location/${encodeURIComponent(query)}`);
      return {
        info: {
          count: 1,
          pages: 1,
          next: null,
          prev: null,
        },
        results: [response],
      };
    } catch (error) {
      console.log(error);
    }
  }

  // Проверяем ввод на то что это несколько id локаций и тогда ищем все нужные локации по id
  const parts = query.trim().split(/[,\s]+/);
  const containsOnlyIds =
    query.trim() !== "" && parts.every((part) => /^\d+$/.test(part));
  const ids = parts.map(Number);
  if (containsOnlyIds) {
    try {
      const response = await apiClient(`/location/${ids.join(",")}`);
      return {
        info: {
          count: response.length,
          pages: 1,
          next: null,
          prev: null,
        },
        results: response,
      };
    } catch (error) {
      console.log(error);
    }
  }

  // Проверяем ввод на то что там пустая строка
  if (!query.trim()) {
    try {
      const response = await apiClient(`/location?page=${page}`);
      return response;
    } catch (error) {
      console.log(error);
    }
  }
}

export default fetchLocations;
