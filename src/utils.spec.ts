import { expect, describe, it, vi } from "vitest";
import {
  chunkify,
  getCellsToCheck,
  getColumnValues,
  getNormalizedValuesToChange,
  getRowValues,
  isFibonacciSequence,
  shouldIBreakLine,
} from "./utils";

vi.mock("./config", () => ({
  totalCells: 25,
  cellsInOneRow: 5,
}));

describe("shouldIBreakLine", () => {
  it("decides when to break line", () => {
    [0, 1, 2, 3, 4].map((v) => expect(shouldIBreakLine(v)).toEqual(false));
    [5, 10, 15, 20].map((v) => expect(shouldIBreakLine(v)).toEqual(true));
  });
});

describe("getColumnValues", () => {
  it("returns the cells in the same column", () => {
    expect(getColumnValues(0)).toEqual([0, 5, 10, 15, 20]);
    expect(getColumnValues(1)).toEqual([1, 6, 11, 16, 21]);
    expect(getColumnValues(8)).toEqual([3, 8, 13, 18, 23]);
  });
});

describe("getRowValues", () => {
  it("returns the cells in the same column", () => {
    expect(getRowValues(0)).toEqual([0, 1, 2, 3, 4]);
    expect(getRowValues(8)).toEqual([5, 6, 7, 8, 9]);
    expect(getRowValues(14)).toEqual([10, 11, 12, 13, 14]);
  });
});

describe("getNormalizedValuesToChange", () => {
  it("identifies values that changed when the cell was clicked", () => {
    expect(getNormalizedValuesToChange(0)).toEqual([
      0, 1, 2, 3, 4, 5, 10, 15, 20,
    ]);
    expect(getNormalizedValuesToChange(8)).toEqual([
      5, 6, 7, 8, 9, 3, 13, 18, 23,
    ]);
    expect(getNormalizedValuesToChange(24)).toEqual([
      20, 21, 22, 23, 24, 4, 9, 14, 19,
    ]);
  });
});

describe("getCellsToCheck", () => {
  it("identifies values that might have become part of fibonacci sequence", () => {
    expect(getCellsToCheck(0)).toEqual([
      [0, 1, 2, 3, 4],
      [0, 5, 10, 15, 20],
    ]);

    expect(getCellsToCheck(8)).toEqual([
      [5, 6, 7, 8, 9],
      [3, 8, 13, 18, 23],
    ]);
  });
});

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

describe.only("chunkify", () => {
  it("returns chunks of defined size", () => {
    expect(chunkify([0, 1, 2, 3, 4, 5], 3)).toEqual([
      [0, 1, 2],
      [1, 2, 3],
      [2, 3, 4],
      [3, 4, 5],
    ]);
  });
});
