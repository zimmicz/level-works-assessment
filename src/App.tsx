/*
"Create a grid of 50x50. When you click on a cell, all values in the
cells in the same row and column are increased  by 1. If a cell is
empty, it will get a value of 1. After each change a cell will briefly
turn yellow. If 5 consecutive numbers in the Fibonacci sequence
are next to each other, these cells will briefly turn green and will
be cleared. Use the programming language of your choice."
 */
import React from "react";
import "./index.css";

const howManyTotalCells = 25;
const howManyCellsInOneRow = 5;

function App() {
  const [values, setValues] = React.useState(() =>
    Array.from({ length: howManyTotalCells }).map(() => 0)
  );
  const [changed, setChanged] = useHighlight();

  const handleCellClick = (value: number) => () => {
    const valuesToChange = getValuesToChange(value);
    setValues((cur) => applyChanges(cur, valuesToChange));
    setChanged(valuesToChange);
  };

  React.useEffect(() => {
    console.log("values", values);
  }, [values]);

  React.useEffect(() => {
    if (changed.length === 0) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setChanged([]);
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, [changed]);

  return (
    <>
      {values.map((_value, i) => (
        <Value
          className={changed.includes(i) ? "highlighted" : undefined}
          key={i}
          onClick={handleCellClick(i)}
          index={i}
        >
          {values[i]}
        </Value>
      ))}
    </>
  );
}

function Value({
  index,
  ...rest
}: React.HTMLAttributes<HTMLButtonElement> & { index: number }) {
  const cell = <button {...rest} />;

  if (shouldIBreakLine(index, howManyCellsInOneRow)) {
    return (
      <>
        <br />
        {cell}
      </>
    );
  }

  return cell;
}

function shouldIBreakLine(currentValue: number, desiredNumberOfCells: number) {
  return currentValue > 0 && currentValue % desiredNumberOfCells === 0;
}

function getColumnValues(cell: number) {
  const howManyBefore = Math.ceil(cell / howManyCellsInOneRow) || 1; // deals with 0
  const base = cell % howManyCellsInOneRow;
  const values: number[] = [];

  for (let i = 0; i < howManyBefore; i += 1) {
    values.push(i * howManyCellsInOneRow + base);
  }

  for (let i = 1; i <= howManyCellsInOneRow - howManyBefore; i += 1) {
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

function useHighlight(): [
  number[],
  React.Dispatch<React.SetStateAction<number[]>>
] {
  const [changed, setChanged] = React.useState<number[]>([]);

  React.useEffect(() => {
    if (changed.length === 0) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setChanged([]);
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, [changed]);

  return [changed, setChanged];
}

export default App;
