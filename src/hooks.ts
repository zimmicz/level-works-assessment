import React from "react";
import { getCellsToCheck, isFibonacciSequence } from "./utils";

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
  (values: number[], changed: number[]) => void,
  () => void
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

  const reset = React.useCallback(() => setSequences([]), []);

  return [sequences, process, reset];
}

export { useHighlight, useFibonacci };
