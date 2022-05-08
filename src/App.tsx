/*
Assessment description:
---------------------

Create a grid of 50x50. When you click on a cell, all values in the
cells in the same row and column are increased  by 1. If a cell is
empty, it will get a value of 1. After each change a cell will briefly
turn yellow. If 5 consecutive numbers in the Fibonacci sequence
are next to each other, these cells will briefly turn green and will
be cleared. Use the programming language of your choice.

My assumptions:
--------------
Fibonacci sequence does not have to start with 0.
If there are six consecutive fibonacci numbers (0, 1, 1, 2, 3, 5), they are considered two separate five numbers long sequences (0, 1, 1, 2, 3) and (1, 1, 2, 3, 5). All the six numbers will be removed.
No recursion is used: if clearing the fibonacci sequence would lead to creation of another one, this wouldn't be removed.
I assume we read left to right and top to bottom - that means 3, 2, 1, 1, 0 is not considered a fibonacci sequence.
 */
import React from "react";
import { useFibonacci, useHighlight } from "./hooks";
import "./index.css";
import type { Position } from "./types";
import {
  applyChanges,
  getInitialValues,
  getNormalizedValuesToChange,
  getNormalizedValuesToChange2,
  shouldIBreakLine,
} from "./utils";

const rows = 20;
const columns = 20;

function App() {
  const [values, setValues] = React.useState(() =>
    getInitialValues({ rows, columns })
  );
  const [changed, setChanged] = useHighlight();
  const [sequences, setSequences, resetSequences] = useFibonacci({
    rows,
    columns,
  });

  const handleCellClick = (position: Position) => () => {
    setChanged(position);
  };

  const getClassNames = (position: Position) => [
    changed &&
    (changed.column === position.column || changed.row === position.row)
      ? "highlighted"
      : undefined,
    sequences &&
    sequences.find(
      (x) => x.row === position.row && x.column === position.column
    )
      ? "cleared"
      : undefined,
  ];

  React.useEffect(() => {
    setValues((cur) => applyChanges(cur, changed, (val) => val + 1));
  }, [changed]);

  React.useEffect(() => {
    if (!changed) {
      return;
    }
    setSequences(values, changed);
  }, [values, changed]);

  React.useEffect(() => {
    const timeout = window.setTimeout(() => {
      const newValues = values;
      sequences.forEach((position) => {
        newValues[position.row][position.column] = 0;
      });
      setValues(newValues);
      resetSequences();
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, [sequences, resetSequences]);

  return (
    <>
      {values.map((row, i) => {
        return (
          <React.Fragment key={i}>
            <span style={{ width: "20px", display: "inline-block" }}>{i}</span>
            {row.map((column, j) => {
              const classNames = getClassNames({ row: i, column: j }).join(" ");
              return (
                <Value
                  className={classNames}
                  key={`${i}-${j}`}
                  onClick={handleCellClick({ row: i, column: j })}
                  row={i}
                  column={j}
                >
                  {column}
                </Value>
              );
            })}
            <br />
          </React.Fragment>
        );
      })}
    </>
  );
}

function Value({
  row,
  column,
  ...rest
}: React.HTMLAttributes<HTMLButtonElement> & Position) {
  return <button {...rest} />;
}

export default App;
