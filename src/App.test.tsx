// @vitest-environment jsdom
// Vitest запускает этот файл в DOM-среде, чтобы React мог отрисовать App.

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import App from "./App";

// После каждого теста удаляем React-компоненты из DOM.
// Иначе следующий тест увидит элементы предыдущего теста.
afterEach(() => {
  cleanup();
  // Сбрасывает подмену fetch на фэйковый fakefetch
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
    {
      id: 183,
      name: "Johnny Depp",
      status: "Alive",
      species: "Human",
      type: "",
      gender: "Male",
      origin: {
        name: "Earth (C-500A)",
        url: "https://rickandmortyapi.com/api/location/23",
      },
      location: {
        name: "Earth (C-500A)",
        url: "https://rickandmortyapi.com/api/location/23",
      },
      image: "https://rickandmortyapi.com/api/character/avatar/183.jpeg",
      episode: ["https://rickandmortyapi.com/api/episode/8"],
      url: "https://rickandmortyapi.com/api/character/183",
      created: "2017-12-29T18:51:29.693Z",
    },
  ],
};

it("starts in character search mode", async () => {
  // React Testing Library помещает App в DOM, созданный jsdom.
  render(<App />);
  // Находим поле <input type="search"> в отрисованном интерфейсе.
  const input = screen.getByRole("searchbox");
  // Проверяем начальный режим поиска: App начинает с characters.
  expect(input.getAttribute("placeholder")).toBe("Search characters...");

  // Создаём сеанс пользователя для ввода и будущих кликов.
  const user = userEvent.setup();
  // Имитируем ввод с клавиатуры. SearchForm обработает события
  // и обновит своё состояние query. Метод асинхронный, поэтому await.
  await user.type(input, "Morty Smith");

  // Vitest проверяет текущее свойство value у поля после ввода.
  expect(input).toHaveProperty("value", "Morty Smith");
});

it("switches search from characters to locations", async () => {
  // Создаём новый App в DOM для этого сценария.
  render(<App />);
  // user-event создаёт объект, который умеет выполнять действия пользователя.
  const user = userEvent.setup();

  // getByRole находит элемент сейчас и возвращает его.
  // Если подходящего элемента нет или их несколько, тест получит ошибку.
  const locationsRadio = screen.getByRole("radio", { name: "Locations" });

  // Происходит взаимодействие: на найденной радиокнопке
  // имитируется клик, после которого React обновляет App.
  await user.click(locationsRadio);

  // Ищем поле уже после обновления интерфейса.
  const input = screen.getByRole("searchbox");
  expect(input.getAttribute("placeholder")).toBe("Search locations...");
});

it("switches search from characters to episodes", async () => {
  // Создаём новый App в DOM для этого сценария.
  render(<App />);
  // user-event создаёт объект, который умеет выполнять действия пользователя.
  const user = userEvent.setup();

  // getByRole находит элемент сейчас и возвращает его.
  // Если подходящего элемента нет или их несколько, тест получит ошибку.
  const episodesRadio = screen.getByRole("radio", { name: "Episodes" });

  // Происходит взаимодействие: на найденной радиокнопке
  // имитируется клик, после которого React обновляет App.
  await user.click(episodesRadio);

  // Ищем поле уже после обновления интерфейса.
  const input = screen.getByRole("searchbox");
  expect(input.getAttribute("placeholder")).toBe("Search episodes...");
});

it("shows a character after searching by name", async () => {
  // Создаём асинхронную функцию фэйкового запроса
  const fakeFetch = vi.fn(async () => {
    return {
      ok: true,
      json: async () => {
        return {
          info: {
            count: 1,
            pages: 1,
            next: null,
            prev: null,
          },
          results: [charactersData.results[0]],
        };
      },
    };
  });
  // Заменяем настоящую функцию фэйковой
  vi.stubGlobal("fetch", fakeFetch);

  // Создаём App
  render(<App />);

  // user-event создаёт объект, который умеет выполнять действия пользователя.
  const user = userEvent.setup();

  // React Testing Library находит поле <input type="search">.
  const input = screen.getByRole("searchbox");

  // user-event вводит указанную строку в найденное поле.
  // Первый аргумент — элемент, второй — текст. Ждём окончания ввода.
  await user.type(input, "Morty Smith");

  // React Testing Library находит кнопку search
  const searchButton = screen.getByRole("button", { name: "Search" });

  // user-event нажимает кнопку search
  await user.click(searchButton);

  // React Testing Library ждёт заголовок карточки после ответа API и обновления App
  // И если не находит тест падает с ошибкой
  await screen.findByRole("heading", {
    name: "Morty Smith",
  });
});

it("shows a message when no character is found", async () => {
  // Создаём асинхронную функцию фэйкового запроса
  const fakeFetch = vi.fn(async () => {
    return {
      ok: false,
      status: 404,
      statusText: "Not Found",
    };
  });
  // Заменяем настоящую функцию фэйковой
  vi.stubGlobal("fetch", fakeFetch);

  // Создаём App
  render(<App />);

  // user-event создаёт объект, который умеет выполнять действия пользователя.
  const user = userEvent.setup();

  // React Testing Library находит поле ввода
  const input = screen.getByRole("searchbox");

  // Имитируем ввод текста в найденное поле ввода
  await user.type(input, "Shimpachi");

  // React Testing Library находит кнопку search
  const searchButton = screen.getByRole("button", { name: "Search" });
  // Жмём на кнопку search
  await user.click(searchButton);

  // Ищем сообщение об ошибке, если не находим тест падает
  await screen.findByText("Sorry, we couldn’t find anything :(");
});

it("show message then wrong symbols is searching", async () => {
  // Создаём асинхронную функцию фэйкового запроса
  const fakeFetch = vi.fn(() => {});
  // Подменяем ею глобальный fetch, который использует API-клиент.
  vi.stubGlobal("fetch", fakeFetch);
  // Создаём App
  render(<App />);
  // user-event создаёт объект, который умеет выполнять действия пользователя.
  const user = userEvent.setup();
  // React Testing Library находит поле ввода
  const input = screen.getByRole("searchbox");
  // Имитируем ввод текста в найденное поле ввода
  await user.type(input, "???");
  // React Testing Library находит кнопку search
  const searchButton = screen.getByRole("button", { name: "Search" });
  // Жмём на кнопку search
  await user.click(searchButton);

  // Ищем сообщение об ошибке, если не находим тест падает
  await screen.findByText("Please enter a name, one ID, or several IDs.");

  // Неверный ввод был отклонён до сетевого запроса.
  expect(fakeFetch).not.toHaveBeenCalled();
});

it("saves search type and query to localStorage after search", async () => {
  // Создаём асинхронную функцию фэйкового запроса
  const fakeFetch = vi.fn(async () => {
    return {
      ok: true,
      json: async () => {
        return {
          info: {
            count: 1,
            pages: 1,
            next: null,
            prev: null,
          },
          results: [charactersData.results[0]],
        };
      },
    };
  });

  // Заменяем настоящий fetch вторым фэйковым
  vi.stubGlobal("fetch", fakeFetch);

  // Создаём App
  render(<App />);
  // user-event создаёт объект, который умеет выполнять действия пользователя.
  const user = userEvent.setup();
  // React Testing Library находит поле ввода
  const input = screen.getByRole("searchbox");
  // Имитируем ввод текста в найденное поле ввода
  await user.type(input, "Morty Smith");
  // React Testing Library находит кнопку search
  const searchButton = screen.getByRole("button", { name: "Search" });
  // Жмём на кнопку search
  await user.click(searchButton);

  // Ожидаем что записанное в localStorage равно 'characters' и "Morty Smith"
  expect(localStorage.getItem("searchType")).toBe(JSON.stringify("characters"));
  expect(localStorage.getItem("searchQuery")).toBe(
    JSON.stringify("Morty Smith"),
  );
});

it("refresh localStorage after switch search type", async () => {
  // Создаём асинхронную функцию фэйкового запроса
  const fakeFetch = vi.fn(async () => {
    return {
      ok: true,
      json: async () => {
        return {
          info: {
            count: 1,
            pages: 1,
            next: null,
            prev: null,
          },
          results: [charactersData.results[0]],
        };
      },
    };
  });
  // Заменяем настоящий fetch вторым фэйковым
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
  // React Testing Library находит поле переключения поиска
  const locationsRadio = screen.getByRole("radio", { name: "Locations" });
  // user-event нажимает кнопку location
  await user.click(locationsRadio);
  // Ожидаем что записанное в localStorage равно null
  expect(localStorage.getItem("searchType")).toBeNull();
  expect(localStorage.getItem("searchQuery")).toBeNull();
});

it("restore search from localStorage", async () => {
  // Создаём асинхронную функцию фэйкового запроса
  const fakeFetch = vi.fn(async () => {
    return {
      ok: true,
      json: async () => {
        return {
          info: {
            count: 1,
            pages: 1,
            next: null,
            prev: null,
          },
          results: [charactersData.results[0]],
        };
      },
    };
  });
  const pageUrl =
    "https://rickandmortyapi.com/api/character?name=Morty+Smith&page=1";

  // Заменяем настоящий fetch вторым фэйковым
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
  // Ожидаем что ещё раз заменённый заменённый fetch вызовется только один раз
  expect(fetch).toHaveBeenCalledTimes(1);
  // Смотрим что request отправил в fetch в зависимости от searchType
  expect(fetch).toHaveBeenCalledWith(pageUrl);
});
