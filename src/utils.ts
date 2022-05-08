import { cellsInOneRow, totalCells } from "./config";
import { Position } from "./types";

function getColumnValues(cell: number) {
  const howManyBefore = Math.floor(cell / cellsInOneRow);
  const base = cell % cellsInOneRow;
  const values: number[] = [];

  for (let i = 0; i < howManyBefore; i += 1) {
    values.push(i * cellsInOneRow + base);
  }

  for (let i = 0; i < cellsInOneRow - howManyBefore; i += 1) {
    values.push(i * cellsInOneRow + cell);
  }

  return values;
}

function getRowValues(cell: number) {
  const firstValueInARow = Math.floor(cell / cellsInOneRow) * cellsInOneRow;
  const values = [firstValueInARow];

  for (let i = 1; i < cellsInOneRow; i += 1) {
    values.push(firstValueInARow + i);
  }

  return values;
}

function getValuesToChange(cell: number) {
  return {
    row: getRowValues(cell),
    column: getColumnValues(cell),
  };
}

function getNormalizedValuesToChange(cell: number) {
  const { row, column } = getValuesToChange(cell);

  return Array.from(new Set([...row, ...column]));
}

function applyChanges(
  values: number[][],
  changed: Position | undefined,
  callback: (value: number) => number
) {
  if (!changed) {
    return values;
  }
  const newValues = values.map((cols, row) =>
    cols.map((value, col) => {
      if (row === changed.row || col === changed.column) {
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

  console.log("values", values);
  return values;
}

function isFibonacciSequence(values: number[]) {
  let [prev] = values;
  let i = 1;

  if (values.lastIndexOf(0) > 0) {
    return false;
  }

  if (values.some((v) => typeof v !== "number")) {
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

function getCellsToCheck(cell: number) {
  const { row, column } = getValuesToChange(cell);
  const rowPosition = row.indexOf(cell);
  const columnPosition = column.indexOf(cell);
  const positions = [
    [-4, -3, -2, -1, 0],
    [-3, -2, -1, 0, 1],
    [-2, -1, 0, 1, 2],
    [-1, 0, 1, 2, 3],
    [0, 1, 2, 3, 4],
  ];

  const rowPositions = positions
    .map((sequence) => sequence.map((position) => row[position + rowPosition]))
    .filter((sequence) => sequence.every((value) => row.includes(value)));

  const columnPositions = positions
    .map((sequence) =>
      sequence.map((position) => column[position + columnPosition])
    )
    .filter((sequence) => sequence.every((value) => column.includes(value)));

  const sequences = [...rowPositions, ...columnPositions].filter((values) =>
    values.every((v) => typeof v === "number")
  );

  return sequences;
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

export {
  applyChanges,
  getInitialValues,
  getRowValues,
  getColumnValues,
  getNormalizedValuesToChange,
  isFibonacciSequence,
  getCellsToCheck,
  chunkify,
};
