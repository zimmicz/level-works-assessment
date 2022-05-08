import React from "react";
import type { Position } from "./types";
import _ from "lodash";
import { chunkify, getCellsToCheck, isFibonacciSequence } from "./utils";

function useHighlight(): [
  Position | undefined,
  React.Dispatch<React.SetStateAction<Position | undefined>>
] {
  const [changed, setChanged] = React.useState<Position>();

  React.useEffect(() => {
    if (!changed) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setChanged(undefined);
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, [changed]);

  return [changed, setChanged];
}

function getNeighboursToCheck(cell: Position, max: number) {
  const toBeChecked = _.range(cell.row - 5, cell.row + 5).filter(
    (row) => row >= 0 && row <= max
  );

  return toBeChecked;
}

function useFibonacci({
  rows,
  columns,
}: {
  rows: number;
  columns: number;
}): [Position[], (values: number[][], changed: Position) => void, () => void] {
  const [sequences, setSequences] = React.useState<Position[]>([]);

  const process = (values: number[][], changed: Position) => {
    if (!changed) {
      return;
    }

    const toBeChecked: Position[][] = [];
    const rowsToCheck = getNeighboursToCheck(changed, rows - 1);
    const columnsToCheck = getNeighboursToCheck(changed, columns - 1);
    const columnChunks = chunkify(columnsToCheck, 5);
    const rowChunks = chunkify(rowsToCheck, 5);
    const iterableRows = _.range(0, rows);
    const iterableColumns = _.range(0, columns);

    /* now i need all column chunks for each row in iterableRows so the product looks like this:
     * [
     * [{ row: 0, column: 0}, { row: 0, column: 1}, { row: 0, column 2 }]
     * [{ row: 1, column: 0}, { row: 1, column: 1}, { row: 1, column 2 }]
     * ...
     * ]
     *
     * and vice versa for row chunks
     */

    toBeChecked.push(
      ...iterableRows
        .map((row) =>
          columnChunks.map((chunk) =>
            chunk
              .map((column) => ({ column, row }))
              .flat()
              .flat()
          )
        )
        .flat()
    );

    toBeChecked.push(
      ...iterableColumns
        .map((column) =>
          rowChunks.map((chunk) =>
            chunk
              .map((row) => ({ column, row }))
              .flat()
              .flat()
          )
        )
        .flat()
    );

    const fibonacciSequences = toBeChecked
      .map((cells) => {
        console.log(cells);
        const cellValues = cells.map((cell) => values[cell.row][cell.column]);
        const match = isFibonacciSequence(cellValues);
        if (match) {
          return cells;
        }
      })
      .filter((sequence): sequence is Position[] =>
        sequence ? sequence.every((v) => "row" in v && "column" in v) : false
      );

    console.log(toBeChecked);
    setSequences(fibonacciSequences.flat());
  };

  const reset = React.useCallback(() => setSequences([]), []);

  return [sequences, process, reset];
}

export { useHighlight, useFibonacci };
