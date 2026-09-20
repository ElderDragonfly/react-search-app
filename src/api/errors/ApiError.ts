import type { ErrorInfo } from "../../components/types/types";

export class ApiError extends Error {
  public status: number;
  public statusText: string;
  constructor(status: number, statusText: string) {
    super(`Api Error: ${status}`);
    this.status = status;
    this.statusText = statusText;
  }
}

export function handleError(error: unknown): ErrorInfo {
// Ветка если сервер ответил но responce не ok
      if (error instanceof ApiError) {
        if (error.status === 404) {
          return {
              status: error.status,
              message: "Sorry, we couldn’t find anything :("
            }
            
        } else if (error.status >= 400 && error.status <= 499) {
          return{
              status: error.status,
              message: "We couldn’t process your request. Please try again.",
            }
        } else if (error.status >= 500) {
          return {
              status: error.status,
              message:
                "The service encountered a problem. Please try again later.",
            }
        } else {
          return {
            status: error.status,
            message: "Something went wrong. Please try again later.",
          };
}
      } else if (error instanceof Error) {
        if (error.message === "Invalid query format") {
          return {
              status: null,
              message: "Please enter a name, one ID, or several IDs.",
            }
        } else {
          return {
              status: null,
              message:
                "We couldn’t complete your request. Please try again later.",
            }
        }
      } else {
        return {
            status: null,
            message: "Something went wrong. Please try again later.",
          }
}}
