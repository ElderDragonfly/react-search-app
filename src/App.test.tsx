// @vitest-environment jsdom
// Vitest запускает этот файл в DOM-среде, чтобы React мог отрисовать App.

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import App from "./App";

// После каждого теста удаляем React-компоненты из DOM.
// Иначе следующий тест увидит элементы предыдущего теста.
afterEach(() => {
  cleanup();
  // Сбрасывает подмену fetch на фэйковый fakefetch
  vi.unstubAllGlobals();
});

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
  const mortyInfo = {
    id: 2,
    name: "Morty Smith",
    status: "Alive",
    species: "Human",
    type: "",
    gender: "Male",
    origin: {
      name: "unknown",
      url: "",
    },
    location: {
      name: "Citadel of Ricks",
      url: "https://rickandmortyapi.com/api/location/3",
    },
    image: "https://rickandmortyapi.com/api/character/avatar/2.jpeg",
    episode: [
      "https://rickandmortyapi.com/api/episode/1",
      "https://rickandmortyapi.com/api/episode/2",
      "https://rickandmortyapi.com/api/episode/3",
      "https://rickandmortyapi.com/api/episode/4",
      "https://rickandmortyapi.com/api/episode/5",
      "https://rickandmortyapi.com/api/episode/6",
      "https://rickandmortyapi.com/api/episode/7",
      "https://rickandmortyapi.com/api/episode/8",
      "https://rickandmortyapi.com/api/episode/9",
      "https://rickandmortyapi.com/api/episode/10",
      "https://rickandmortyapi.com/api/episode/11",
      "https://rickandmortyapi.com/api/episode/12",
      "https://rickandmortyapi.com/api/episode/13",
      "https://rickandmortyapi.com/api/episode/14",
      "https://rickandmortyapi.com/api/episode/15",
      "https://rickandmortyapi.com/api/episode/16",
      "https://rickandmortyapi.com/api/episode/17",
      "https://rickandmortyapi.com/api/episode/18",
      "https://rickandmortyapi.com/api/episode/19",
      "https://rickandmortyapi.com/api/episode/20",
      "https://rickandmortyapi.com/api/episode/21",
      "https://rickandmortyapi.com/api/episode/22",
      "https://rickandmortyapi.com/api/episode/23",
      "https://rickandmortyapi.com/api/episode/24",
      "https://rickandmortyapi.com/api/episode/25",
      "https://rickandmortyapi.com/api/episode/26",
      "https://rickandmortyapi.com/api/episode/27",
      "https://rickandmortyapi.com/api/episode/28",
      "https://rickandmortyapi.com/api/episode/29",
      "https://rickandmortyapi.com/api/episode/30",
      "https://rickandmortyapi.com/api/episode/31",
      "https://rickandmortyapi.com/api/episode/32",
      "https://rickandmortyapi.com/api/episode/33",
      "https://rickandmortyapi.com/api/episode/34",
      "https://rickandmortyapi.com/api/episode/35",
      "https://rickandmortyapi.com/api/episode/36",
      "https://rickandmortyapi.com/api/episode/37",
      "https://rickandmortyapi.com/api/episode/38",
      "https://rickandmortyapi.com/api/episode/39",
      "https://rickandmortyapi.com/api/episode/40",
      "https://rickandmortyapi.com/api/episode/41",
      "https://rickandmortyapi.com/api/episode/42",
      "https://rickandmortyapi.com/api/episode/43",
      "https://rickandmortyapi.com/api/episode/44",
      "https://rickandmortyapi.com/api/episode/45",
      "https://rickandmortyapi.com/api/episode/46",
      "https://rickandmortyapi.com/api/episode/47",
      "https://rickandmortyapi.com/api/episode/48",
      "https://rickandmortyapi.com/api/episode/49",
      "https://rickandmortyapi.com/api/episode/50",
      "https://rickandmortyapi.com/api/episode/51",
    ],
    url: "https://rickandmortyapi.com/api/character/2",
    created: "2017-11-04T18:50:21.651Z",
  };
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
          results: [mortyInfo],
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
