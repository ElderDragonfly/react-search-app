import { Component, type ErrorInfo, type ReactNode } from "react";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  // React вызывает этот метод, если дочерний компонент
  // выбросил ошибку во время отрисовки.
  // Возвращённое значение обновляет state.
  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  // React вызывает этот метод после обнаружения ошибки.
  // error - сама ошибка, info.componentStack - путь по компонентам.
  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("Rendering error:", error, info.componentStack);
  }

  render(): ReactNode {
    // После ошибки вместо сломанного интерфейса показываем запасной.
    if (this.state.hasError) {
      return (
        <div className="error-boundary" role="alert">
          Something went wrong. Please reload the page.
        </div>
      );
    }

    // Пока ошибок нет, показываем компоненты без изменений.
    return this.props.children;
  }
}

export default ErrorBoundary;
