// @vitest-environment jsdom
// Vitest запускает этот файл в DOM-среде, чтобы React мог отрисовать App.

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import App from "../../App";

// После каждого теста удаляем React-компоненты из DOM.
// Иначе следующий тест увидит элементы предыдущего теста.
afterEach(() => {
  cleanup();
  // Сбрасывает подмену fetch на фэйковый fakefetch
  vi.unstubAllGlobals();
});

it("shows the second page of character search results", async () => {
  const info = {
    count: 21,
    pages: 2,
    next: null,
    prev: null,
  };

  const firstResults = [
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
  ];
  const secondResults = [
    {
      id: 206,
      name: "Lizard Morty",
      status: "Alive",
      species: "Humanoid",
      type: "Lizard-Person",
      gender: "Male",
      origin: {
        name: "unknown",
        url: "",
      },
      location: {
        name: "Citadel of Ricks",
        url: "https://rickandmortyapi.com/api/location/3",
      },
      image: "https://rickandmortyapi.com/api/character/avatar/206.jpeg",
      episode: ["https://rickandmortyapi.com/api/episode/28"],
      url: "https://rickandmortyapi.com/api/character/206",
      created: "2017-12-30T13:06:09.094Z",
    },
  ];
  const firstPageUrl =
    "https://rickandmortyapi.com/api/character?name=Morty&page=1";
  const secondPageUrl =
    "https://rickandmortyapi.com/api/character?name=Morty&page=2";

  // Создаём данные которые нам "вернёт" фэйковый первый fetch в зависимости от searchType
  const firstApiData = {
    info: info,
    results: firstResults,
  };
  const firstFakeFetch = vi.fn(async () => {
    return {
      ok: true,
      json: async () => {
        return firstApiData;
      },
    };
  });

  // Создаём данные которые нам "вернёт" фэйковый второй fetch в зависимости от searchType
  const secondApiData = {
    info: info,
    results: secondResults,
  };
  const secondFakeFetch = vi.fn(async () => {
    return {
      ok: true,
      json: async () => {
        return secondApiData;
      },
    };
  });

  // Заменяем настоящий fetch первым фэйковым
  vi.stubGlobal("fetch", firstFakeFetch);

  // React Testing Library помещает App в DOM, созданный jsdom.
  render(<App />);
  // user-event создаёт объект, который умеет выполнять действия пользователя.
  const user = userEvent.setup();
  // React Testing Library находит поле ввода
  const input = screen.getByRole("searchbox");
  // Имитируем ввод текста в найденное поле ввода
  await user.type(input, "Morty");
  // React Testing Library находит кнопку search
  const searchButton = screen.getByRole("button", { name: "Search" });
  // Жмём на кнопку search
  await user.click(searchButton);
  // React Testing Library ждёт заголовок карточки после ответа API и обновления App
  // И если не находит тест падает с ошибкой
  await screen.findByRole("heading", {
    name: "Morty Smith",
  });
  // Ожидаем что заменённый fetch вызовется только один раз
  expect(firstFakeFetch).toHaveBeenCalledTimes(1);
  // Смотрим что request отправил в fetch в зависимости от searchType
  expect(firstFakeFetch).toHaveBeenCalledWith(firstPageUrl);

  // Заменяем настоящий fetch вторым фэйковым
  vi.stubGlobal("fetch", secondFakeFetch);
  // React Testing Library находит вторую кнопку пагинации
  const paginationButton = screen.getByRole("button", { name: "2" });
  // Жмём на кнопку пагинации
  await user.click(paginationButton);
  // React Testing Library ждёт заголовок карточки после ответа API и обновления App
  // И если не находит тест падает с ошибкой
  await screen.findByRole("heading", {
    name: "Lizard Morty",
  });
  // Ожидаем что ещё раз заменённый заменённый fetch вызовется только один раз
  expect(secondFakeFetch).toHaveBeenCalledTimes(1);
  // Смотрим что request отправил в fetch в зависимости от searchType
  expect(secondFakeFetch).toHaveBeenCalledWith(secondPageUrl);
});
