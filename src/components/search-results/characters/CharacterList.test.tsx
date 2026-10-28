// @vitest-environment jsdom
// Vitest запускает этот файл в DOM-среде, чтобы React мог отрисовать App.
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import App from "../../../App";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

// Перед каждым тестом очищаем localStorage
beforeEach(() => {
  localStorage.clear();
});

const charactersData = {
  info: {
    count: 1,
    pages: 1,
    next: null,
    prev: null,
  },
  results: [
    {
      id: 2,
      name: "Morty Smith",
      status: "Alive",
      species: "Human",
      type: "",
      gender: "Male",
      origin: {
        name: "Earth",
        url: "https://rickandmortyapi.com/api/location/1",
      },
      location: {
        name: "Earth",
        url: "https://rickandmortyapi.com/api/location/20",
      },
      image: "https://rickandmortyapi.com/api/character/avatar/2.jpeg",
      episode: [
        "https://rickandmortyapi.com/api/episode/1",
        "https://rickandmortyapi.com/api/episode/2",
      ],
      url: "https://rickandmortyapi.com/api/character/2",
      created: "2017-11-04T18:50:21.651Z",
    },
  ],
};

const episodesData = [
  {
    id: 1,
    name: "Pilot",
    episode: "S01E01",
    air_date: "December 2, 2013",
    characters: [],
    url: "https://rickandmortyapi.com/api/episode/1",
    created: "2017-11-10T12:56:33.798Z",
  },
  {
    id: 2,
    name: "Lawnmower Dog",
    episode: "S01E02",
    air_date: "December 9, 2013",
    characters: [],
    url: "https://rickandmortyapi.com/api/episode/2",
    created: "2017-11-10T12:56:33.916Z",
  },
];

it("show modal character card", async () => {
  const pageUrl =
    "https://rickandmortyapi.com/api/character?name=Morty+Smith&page=1";
  const episodeUrl = "https://rickandmortyapi.com/api/episode/1,2";
  // Создаём асинхронную функцию фэйкового запроса
  const fakeFetch = vi.fn(async (url: string) => {
    if (url === pageUrl) {
      return {
        ok: true,
        json: async () => {
          return charactersData;
        },
      };
    } else if (url === episodeUrl) {
      return {
        ok: true,
        json: async () => episodesData,
      };
    }
    // Если вдруг запрос который не предусмотрен
    throw new Error(`Unexpected request: ${url}`);
  });

  // Заменяем настоящий fetch фэйковым
  vi.stubGlobal("fetch", fakeFetch);
  // Заполняем localStorage для теста
  localStorage.setItem("searchType", JSON.stringify("characters"));
  localStorage.setItem("searchQuery", JSON.stringify("Morty Smith"));
  // Создаём App
  render(<App />);
  // React Testing Library ждёт заголовок карточки после ответа API и обновления App
  // И если не находит тест падает с ошибкой
  await screen.findByRole("heading", {
    name: "Morty Smith",
  });

  // user-event создаёт объект, который умеет выполнять действия пользователя.
  const user = userEvent.setup();

  // React Testing Library находит карточку персонажа
  const characterListItem = screen.getByRole("listitem");
  // Ищем кнопку только внутри characterListItem
  const characterButton = within(characterListItem).getByRole("button");

  // user-event нажимает на карточку персонажа
  await user.click(characterButton);

  // Находим и сохраняем кнопку закрытия.
  const closeButton = await screen.findByRole("button", {
    name: "Close modal",
  });

  // React Testing Library ждёт кнопку закрытия модального окна
  // И если не находит тест падает с ошибкой
  await screen.findByRole("button", {
    name: "Close modal",
  });
  // Дожидаемся загрузки эпизодов внутри модального окна и проверем их
  await screen.findByText("Pilot");

  await user.click(closeButton);
  // Проверяем закрытие по кнопке модалки
  expect(screen.queryByRole("button", { name: "Close modal" })).toBeNull();
});

it("show error message for episodes in character modal", async () => {
  const pageUrl =
    "https://rickandmortyapi.com/api/character?name=Morty+Smith&page=1";
  const episodeUrl = "https://rickandmortyapi.com/api/episode/1,2";
  // Создаём асинхронную функцию фэйкового запроса
  const fakeFetch = vi.fn(async (url: string) => {
    if (url === pageUrl) {
      return {
        ok: true,
        json: async () => {
          return charactersData;
        },
      };
    } else if (url === episodeUrl) {
      return {
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      };
    }
    // Если вдруг запрос который не предусмотрен
    throw new Error(`Unexpected request: ${url}`);
  });

  // Заменяем настоящий fetch фэйковым
  vi.stubGlobal("fetch", fakeFetch);
  // Заполняем localStorage для теста
  localStorage.setItem("searchType", JSON.stringify("characters"));
  localStorage.setItem("searchQuery", JSON.stringify("Morty Smith"));
  // Создаём App
  render(<App />);
  // React Testing Library ждёт заголовок карточки после ответа API и обновления App
  // И если не находит тест падает с ошибкой
  await screen.findByRole("heading", {
    name: "Morty Smith",
  });

  // user-event создаёт объект, который умеет выполнять действия пользователя.
  const user = userEvent.setup();

  // React Testing Library находит карточку персонажа
  const characterListItem = screen.getByRole("listitem");
  // Ищем кнопку только внутри characterListItem
  const characterButton = within(characterListItem).getByRole("button");

  // user-event нажимает на карточку персонажа
  await user.click(characterButton);

  // React Testing Library ждёт кнопку закрытия модального окна
  // И если не находит тест падает с ошибкой
  await screen.findByRole("button", {
    name: "Close modal",
  });

  // Дожидаемся результата обработки ошибки.
  const errorMessage = await screen.findByRole("alert");

  expect(errorMessage.textContent).toContain(
    "The service encountered a problem. Please try again later.",
  );

  // Эпизоды не отображаются.
  expect(screen.queryByText("Pilot")).toBeNull();
});

it("shows the selected episode from the character modal", async () => {
  const pageUrl =
    "https://rickandmortyapi.com/api/character?name=Morty+Smith&page=1";
  const episodeUrl = "https://rickandmortyapi.com/api/episode/1,2";
  const selectedEpisodeUrl = "https://rickandmortyapi.com/api/episode/1";
  // Создаём асинхронную функцию фэйкового запроса
  const fakeFetch = vi.fn(async (url: string) => {
    if (url === pageUrl) {
      return {
        ok: true,
        json: async () => {
          return charactersData;
        },
      };
    } else if (url === episodeUrl) {
      return {
        ok: true,
        json: async () => episodesData,
      };
    } else if (url === selectedEpisodeUrl) {
      return {
        ok: true,
        json: async () => episodesData[0],
      };
    }
    // Если вдруг запрос который не предусмотрен
    throw new Error(`Unexpected request: ${url}`);
  });

  // Заменяем настоящий fetch фэйковым
  vi.stubGlobal("fetch", fakeFetch);
  // Заполняем localStorage для теста
  localStorage.setItem("searchType", JSON.stringify("characters"));
  localStorage.setItem("searchQuery", JSON.stringify("Morty Smith"));
  // Создаём App
  render(<App />);
  // React Testing Library ждёт заголовок карточки после ответа API и обновления App
  // И если не находит тест падает с ошибкой
  await screen.findByRole("heading", {
    name: "Morty Smith",
  });

  // user-event создаёт объект, который умеет выполнять действия пользователя.
  const user = userEvent.setup();

  // React Testing Library находит карточку персонажа
  const characterListItem = screen.getByRole("listitem");
  // Ищем кнопку только внутри characterListItem
  const characterButton = within(characterListItem).getByRole("button");

  // user-event нажимает на карточку персонажа
  await user.click(characterButton);

  // React Testing Library находит ссылку на эпизод
  const episodeLink = await screen.findByText("Pilot");
  // user-event нажимает на ссылку на эпизод
  await user.click(episodeLink);

  // ищем заголовок карточки в списке episodes
  await screen.findByRole("heading", { name: "Pilot" });
  // Проверяем что модального окна нет
  expect(screen.queryByRole("button", { name: "Close modal" })).toBeNull();
});
