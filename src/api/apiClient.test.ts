import { describe, it, expect } from "vitest";
import fetchResults from "./apiClient";

describe(fetchResults, () => {
  it("handle ", () => {
      const result = fetchResults('characters', 'rick');
      expect(result).toEqual()
  });
});
