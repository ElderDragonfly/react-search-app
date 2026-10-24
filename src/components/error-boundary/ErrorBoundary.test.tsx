// @vitest-environment jsdom
// Vitest запускает этот файл в DOM-среде, чтобы React мог отрисовать App.
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import ErrorBoundary from "./ErrorBoundary";
import ErrorTestButton from "./ErrorTestButton";

afterEach(() => {
  // убирает отрисованные компоненты
  cleanup();
  // возвращает исходный console.error
  vi.restoreAllMocks();
});

it("click error boundary button", async () => {
  // spyOn начинает отслеживать вызовы console.error и их аргументы.
  // mockImplementation заменяет вывод пустой функцией, чтобы намеренная ошибка не засоряла консоль
  const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

  // В тесте сами создаём защищённое дерево компонентов.
  render(
    <ErrorBoundary>
      <ErrorTestButton />
    </ErrorBoundary>,
  );

  // Находим кнопку теста ошибки
  const errorTestButton = screen.getByRole("button", {
    name: "Test error boundary",
  });
  // user-event создаёт объект, который умеет выполнять действия пользователя.
  const user = userEvent.setup();

  // Виртуаольный юзер кликает кнопку теста ошибки
  await user.click(errorTestButton);

  // Ищем сообщение об ошибке, если не находим тест падает
  await screen.findByText("Something went wrong. Please reload the page.");

  // проверяем чтобы ошибка записалась в консоль
  expect(consoleError).toHaveBeenCalledWith(
    "Rendering error:",
    expect.any(Error),
    expect.any(String),
  );
});
