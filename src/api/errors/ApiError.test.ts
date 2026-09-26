import { describe, it, expect } from "vitest";
import { ApiError, handleError } from "./ApiError";

describe(handleError, () => {
  it("handles 404 error", () => {
    const error = new ApiError(404, "Not found");
    const result = handleError(error);
    expect(result).toEqual({
      status: 404,
      message: "Sorry, we couldn’t find anything :(",
    });
  });
  it.each([400, 403, 499])("handles 4xx errors exclude 404", (status) => {
    const error = new ApiError(status, "");
    const result = handleError(error);
    expect(result).toEqual({
      status,
      message: "We couldn’t process your request. Please try again.",
    });
  });
  it.each([500, 503, 599])("handles 5xx errors", (status) => {
    const error = new ApiError(status, "");
    const result = handleError(error);
    expect(result).toEqual({
      status,
      message: "The service encountered a problem. Please try again later.",
    });
  });
  it.each([100, 200, 300, 399])(
    "returns a fallback message for an unexpected ApiError status",
    (status) => {
      const error = new ApiError(status, "");
      const result = handleError(error);
      expect(result).toEqual({
        status,
        message: "Something went wrong. Please try again later.",
      });
    },
  );
  it("returns a general message for a non-API error with message", () => {
    const error = new Error("Invalid query format");
    const result = handleError(error);
    expect(result).toEqual({
      status: null,
      message: "Please enter a name, one ID, or several IDs.",
    });
  });
  it("returns a general message for a non-API error without message", () => {
    const error = new Error();
    const result = handleError(error);
    expect(result).toEqual({
      status: null,
      message: "We couldn’t complete your request. Please try again later.",
    });
  });
  it.each([null, undefined, "error", 42, {}])(
    "returns an input hint for an invalid query format error",
    (error) => {
      const result = handleError(error);
      expect(result).toEqual({
        status: null,
        message: "Something went wrong. Please try again later.",
      });
    },
  );
});
