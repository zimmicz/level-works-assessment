const totalCells = 25;
const cellsInOneRow = 5;

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
  return Array.from({ length: totalCells }).map(() => 0);
}

export {
  applyChanges,
  getInitialValues,
  getRowValues,
  getColumnValues,
  shouldIBreakLine,
  getValuesToChange,
};
