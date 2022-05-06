const totalCells = 100;
const cellsInOneRow = 10;
const fibonacciSequence = 5;

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
  while (i <= values.length) {
    if (
      prev + values[i] !== values[i + 1] &&
      typeof values[i + 1] === "number"
    ) {
      return false;
    }
    prev = values[i];
    i += 1;
  }
  return true;
}

function getCellsToCheck(cell: number) {
  const seq = 3;
  const { row, column } = getValuesToChange(cell);
  const rowPosition = row.indexOf(cell);
  const columnPosition = column.indexOf(cell);

  const rowSeq = [
    [row[rowPosition - 2], row[rowPosition - 1], cell],
    [row[rowPosition - 1], cell, row[rowPosition] + 1],
    [cell, row[rowPosition + 1], row[rowPosition + 2]],
  ];

  const columnSeq = [
    [column[columnPosition - 2], column[columnPosition - 1], cell],
    [column[columnPosition - 1], cell, column[columnPosition + 1]],
    [cell, column[columnPosition + 1], column[columnPosition + 2]],
  ];

  const sequences = [...rowSeq, ...columnSeq].filter((values) =>
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
