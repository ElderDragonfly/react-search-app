import apiClient from "./apiClient";

async function fetchEpisodes(query: string, page: number) {
  // Проверяем ввод на то что это название серии и тогда ищем эпизод по названию
  const containsLetters = /[a-zA-Z]/.test(query);
  if (containsLetters) {
    try {
      const response = await apiClient(
        `/episode?name=${encodeURIComponent(query)}&page=${page}`,
      );
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  // Проверяем ввод на то что это id серии и тогда ищем эпизод по id
  const containsOnlyDigits = /^\d+$/.test(query);
  if (containsOnlyDigits) {
    try {
      const response = await apiClient(`/episode/${encodeURIComponent(query)}`);
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

  // Проверяем ввод на то что это несколько id серий и тогда ищем все нужные эпизоды по id
  const parts = query.trim().split(/[,\s]+/);
  const containsOnlyIds =
    query.trim() !== "" && parts.every((part) => /^\d+$/.test(part));
  const ids = parts.map(Number);
  if (containsOnlyIds) {
    try {
      const response = await apiClient(`/episode/${ids.join(",")}`);
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
      const response = await apiClient(`/episode?page=${page}`);
      return response;
    } catch (error) {
      console.log(error);
    }
  }
}

export default fetchEpisodes;
