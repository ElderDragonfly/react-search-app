import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/main.sass";
import App from "./App.tsx";
import ErrorBoundary from "./components/error-boundary/ErrorBoundary";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
