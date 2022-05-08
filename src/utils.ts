import _ from "lodash";
import { fibonacciSequenceLength } from "./config";
import { Position } from "./types";

type MatcherFn = (a: Position, b: Position) => boolean;

function applyChanges(
  values: number[][],
  changed: Position,
  callback: (value: number) => number
) {
  const newValues = values.map((columns, row) =>
    columns.map((value, column) => {
      if (columnOrRowMatcher(changed)({ row, column })) {
        return callback(value);
      }

      return value;
    })
  );

  return newValues;
}

function getInitialValues({
  rows,
  columns,
}: {
  rows: number;
  columns: number;
}) {
  const values: number[][] = Array.from({ length: rows })
    .map(() => [])
    .map(() => Array.from({ length: columns }).map(() => 0));

  return values;
}

function isFibonacciSequence(values: number[]) {
  let [prev] = values;
  let i = 1;

  if (values.lastIndexOf(0) > 0) {
    return false;
  }

  while (i < values.length - 1) {
    if (prev > values[i]) {
      return false;
    }

    if (typeof values[i + 1] !== "number") {
      return false;
    }

    if (prev + values[i] !== values[i + 1]) {
      return false;
    }

    prev = values[i];
    i += 1;
  }

  return true;
}

function chunkify(arr: number[], size: number) {
  const chunks = [];
  let i = 0;

  while (i < arr.length) {
    if (typeof arr[i + size - 1] === "undefined") {
      break;
    }
    chunks.push(arr.slice(i, i + size));
    i += 1;
  }

  return chunks;
}

function getNeighboursToCheck(position: Position, max: number) {
  const toBeChecked = _.range(
    position.row - fibonacciSequenceLength,
    position.row + fibonacciSequenceLength
  ).filter((row) => row >= 0 && row <= max);

  return toBeChecked;
}

const positionMatcher =
  (matcher: MatcherFn) => (a: Position) => (b: Position) =>
    matcher(a, b);

const columnOrRowMatcher = positionMatcher(
  (a, b) => a.column === b.column || a.row === b.row
);
const columnAndRowMatcher = positionMatcher(
  (a, b) => a.column === b.column && a.row === b.row
);

export {
  getNeighboursToCheck,
  applyChanges,
  getInitialValues,
  isFibonacciSequence,
  chunkify,
  columnAndRowMatcher,
  columnOrRowMatcher,
};
