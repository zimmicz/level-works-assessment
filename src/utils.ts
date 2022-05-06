import { cellsInOneRow, totalCells } from "./config";

function shouldIBreakLine(currentValue: number) {
  return currentValue > 0 && currentValue % cellsInOneRow === 0;
}

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
  values: number[],
  changed: number[],
  callback: (value: number) => number
) {
  if (changed.length === 0) {
    return values;
  }
  const newValues = [...values];
  for (let i = 0; i <= changed.length; i += 1) {
    newValues[changed[i]] = callback(newValues[changed[i]]);
  }

  return newValues;
}

function getInitialValues() {
  return Array.from({ length: totalCells }).map(() => 0);
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
    .map((pos) => pos.map((pos2) => row[pos2 + rowPosition]))
    .filter((portion) => portion.every((v) => row.includes(v)));

  const columnPositions = positions
    .map((pos) => pos.map((pos2) => column[pos2 + columnPosition]))
    .filter((portion) => portion.every((v) => column.includes(v)));

  const sequences = [...rowPositions, ...columnPositions].filter((values) =>
    values.every((v) => typeof v === "number")
  );

  return sequences;
}

export {
  applyChanges,
  getInitialValues,
  getRowValues,
  getColumnValues,
  shouldIBreakLine,
  getNormalizedValuesToChange,
  isFibonacciSequence,
  getCellsToCheck,
};
