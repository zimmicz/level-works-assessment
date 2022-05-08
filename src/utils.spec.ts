import { vi } from "vitest";
import {
  getInitialValues,
  chunkify,
  isFibonacciSequence,
  getNeighboursToCheck,
} from "./utils";

vi.mock("./config", () => ({
  fibonacciSequenceLength: 5,
}));

describe("isFibonacciSequence", () => {
  it("decides if numbers are fibonacci sequence or not", () => {
    expect(isFibonacciSequence([0, 0, 0])).toEqual(false);
    expect(isFibonacciSequence([0, 1, 0])).toEqual(false);
    expect(isFibonacciSequence([0, 1, 1])).toEqual(true);
    expect(isFibonacciSequence([1, 0, 1])).toEqual(false);
    expect(isFibonacciSequence([0, 1, 2])).toEqual(false);
    expect(isFibonacciSequence([2, 1, 3])).toEqual(false);
    expect(isFibonacciSequence([3, 1, 2])).toEqual(false);
  });
});

describe("chunkify", () => {
  it("returns chunks of defined size", () => {
    expect(chunkify([0, 1, 2, 3, 4, 5], 3)).toEqual([
      [0, 1, 2],
      [1, 2, 3],
      [2, 3, 4],
      [3, 4, 5],
    ]);
  });
});

describe("getInitialValues", () => {
  it("creates 2d array", () => {
    expect(getInitialValues({ rows: 5, columns: 5 })).toEqual([
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ]);
  });
});

describe("getNeighboursToCheck", () => {
  it("identifies neighbours of the given position that might have changed", () => {
    expect(getNeighboursToCheck(3, 10)).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
    expect(getNeighboursToCheck(3, 5)).toEqual([0, 1, 2, 3, 4, 5]);
  });
});
