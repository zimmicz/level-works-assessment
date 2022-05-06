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
import {
  applyChanges,
  getCellsToCheck,
  getInitialValues,
  getNormalizedValuesToChange,
  isFibonacciSequence,
  shouldIBreakLine,
} from "./utils";

function App() {
  const [values, setValues] = React.useState(getInitialValues);
  const [changed, setChanged] = useHighlight();
  const [sequences, setSequences] = useFibonacci();

  const handleCellClick = (value: number) => () => {
    const valuesToChange = getNormalizedValuesToChange(value);
    setChanged(valuesToChange);
  };

  React.useEffect(() => {
    setValues((cur) => applyChanges(cur, changed, (val) => val + 1));
  }, [changed]);

  React.useEffect(() => {
    setSequences(values, changed);
  }, [values, changed]);

  React.useEffect(() => {
    const timeout = window.setTimeout(() => {
      setValues((cur) => applyChanges(cur, sequences, () => 0));
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, [sequences]);

  return (
    <>
      {values.map((_value, i) => {
        const classNames = [
          changed.includes(i) ? "highlighted" : undefined,
          sequences.includes(i) ? "cleared" : undefined,
        ].filter(Boolean);

        return (
          <Value
            className={classNames.join(" ")}
            key={i}
            onClick={handleCellClick(i)}
            index={i}
          >
            {values[i]}
          </Value>
        );
      })}
    </>
  );
}

function Value({
  index,
  ...rest
}: React.HTMLAttributes<HTMLButtonElement> & { index: number }) {
  const cell = <button {...rest} />;

  if (shouldIBreakLine(index)) {
    return (
      <>
        <br />
        {cell}
      </>
    );
  }

  return cell;
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

function useFibonacci(): [
  number[],
  (values: number[], changed: number[]) => void
] {
  const [sequences, setSequences] = React.useState<number[]>([]);

  const process = (values: number[], changed: number[]) => {
    if (changed.length === 0) {
      return;
    }

    const cellsToCheck = changed.map(getCellsToCheck).flat();
    const fibonacciSequences = cellsToCheck
      .map((cells) => {
        const cellValues = cells.map((cell) => values[cell]);
        const match = isFibonacciSequence(cellValues);
        if (match) {
          return cells;
        }
      })
      .filter((sequence): sequence is number[] =>
        sequence ? sequence.every((v) => typeof v === "number") : false
      );

    setSequences(fibonacciSequences.flat());
  };

  React.useEffect(() => {
    if (sequences.length === 0) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setSequences([]);
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, [sequences]);

  return [sequences, process];
}

export default App;
