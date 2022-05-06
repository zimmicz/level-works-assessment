const howManyTotalCells = 25;
const howManyCellsInOneRow = 5;

function shouldIBreakLine(currentValue: number) {
  return currentValue > 0 && currentValue % howManyCellsInOneRow === 0;
}

function getColumnValues(cell: number) {
  const howManyBefore = Math.floor(cell / howManyCellsInOneRow);
  const base = cell % howManyCellsInOneRow;
  const values: number[] = [];

  for (let i = 0; i < howManyBefore; i += 1) {
    values.push(i * howManyCellsInOneRow + base);
  }

  for (let i = 0; i < howManyCellsInOneRow - howManyBefore; i += 1) {
    values.push(i * howManyCellsInOneRow + cell);
  }

  return values;
}

function getRowValues(cell: number) {
  const firstValueInARow =
    Math.floor(cell / howManyCellsInOneRow) * howManyCellsInOneRow;
  const values = [firstValueInARow];

  for (let i = 1; i < howManyCellsInOneRow; i += 1) {
    values.push(firstValueInARow + i);
  }

  return values;
}

function getValuesToChange(cell: number) {
  const valuesToChange = Array.from(
    new Set([...getColumnValues(cell), ...getRowValues(cell)])
  );

  return valuesToChange;
}

function applyChanges(values: number[], changed: number[]) {
  const newValues = [...values];
  for (let i = 0; i <= changed.length; i += 1) {
    newValues[changed[i]] = newValues[changed[i]] + 1;
  }

  return newValues;
}

function getInitialValues() {
  return Array.from({ length: howManyTotalCells }).map(() => 0);
}

export {
  applyChanges,
  getInitialValues,
  getRowValues,
  getColumnValues,
  shouldIBreakLine,
  getValuesToChange,
};
