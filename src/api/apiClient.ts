import { ApiError } from "./errors/ApiError";
import type {
  Character,
  Episode,
  Location,
  ResultsInfo,
} from "../components/types/types";

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

type SearchTypeMap = {
  characters: { info: ResultsInfo; results: Character[] };
  locations: { info: ResultsInfo; results: Location[] };
  episodes: { info: ResultsInfo; results: Episode[] };
};

// type FilterType = CharacterFilter;
type FilterType = {
  ids?: number | number[];
  // Персонажи
  name?: string;
  status?: "alive" | "dead" | "unknown";
  species?: string;
  type?: string;
  gender?: "female" | "male" | "genderless" | "unknown"
  // Локации
  dimension?: string
  // Эпизоды
  episode?: string
}

async function fetchResults<Type extends keyof SearchTypeMap>(
  searchType: Type,
  query: string | number | number[],
  page: number = 1,
  filters?: FilterType,
): Promise<SearchTypeMap[Type]> {
  // Приводим searchType к тому, чтобы использовать в URL запроса
  const searchTypePath = searchType.slice(0, -1);

  //
  if (!filters) {
    filters = createFiltersFromValue(query);
  }

  // Проверяем поле ids, и если оно есть запрос по id
  if(filters.ids !== undefined) {
    const ids = Array.isArray(filters.ids) ? filters.ids : [filters.ids];
    // Проверка если массив вдруг пустой
    if (ids.length === 0) {
      throw new Error("IDs list cannot be empty");
    }
    const idsPath = ids.join(",");
    try {
    const response = await request(`/${searchTypePath}/${idsPath}`)
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
      throw error;
    }
  }
  const params = new URLSearchParams();
  // Разбиваем объект на массив массивов ключ-значение в каждом и записываем в params
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) {
      params.set(key, String(value));
    }}
  )
  params.set("page", String(page));
  try {
    const response = await request(`/${searchTypePath}?${params.toString()}`);
    return response;
  } catch (error) {
      console.log(error);
      throw error;
    }
  }

  function createFiltersFromValue(query: string | number | number[],): FilterType {
      // Если введённые данные это строка
  if (typeof query === "string") {
    // Проверяем ввод на то что это название searchType и тогда ищем searchType по названию
    const containsLetters = /[a-zA-Z]/.test(query);
    if (containsLetters) {
      return {name: query};
    }

    // Проверяем ввод на то что это id
    const containsOnlyDigits = /^\d+$/.test(query);
    if (containsOnlyDigits) {
      return {ids: Number(query)}
    }

    // Проверяем ввод на то что это несколько id searchType и тогда ищем все нужные searchType по id
    const parts = query.trim().split(/[,\s]+/);
    const containsOnlyIds =
      query.trim() !== "" && parts.every((part) => /^\d+$/.test(part));
    const ids = parts.map(Number);
    if (containsOnlyIds) {
      return {ids: ids}
    }

    // Проверяем ввод на то что там пустая строка
    if (!query.trim()) {
      return {name: ''}
    }
  }
    // Если введённые данные число или массив чисел
    if (
      typeof query === "number" ||
      (Array.isArray(query) &&
        query.every((item) => typeof item === "number" && !isNaN(item)))
    ) {
      return {ids: query}
    }
      // Если пользователь ввёл формально верный но невалидный запрос
    throw new Error("Invalid query format");
  }


export default fetchResults;