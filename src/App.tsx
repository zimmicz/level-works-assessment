/*
Assesment description:
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
import {
  applyChanges,
  getInitialValues,
  getNormalizedValuesToChange,
  shouldIBreakLine,
} from "./utils";

function App() {
  const [values, setValues] = React.useState(getInitialValues);
  const [changed, setChanged] = useHighlight();
  const [sequences, setSequences, resetSequences] = useFibonacci();

  const handleCellClick = (value: number) => () => {
    const valuesToChange = getNormalizedValuesToChange(value);
    setChanged(valuesToChange);
  };

  const getClassNames = (cell: number) => [
    changed.includes(cell) ? "highlighted" : undefined,
    sequences.includes(cell) ? "cleared" : undefined,
  ];

  React.useEffect(() => {
    setValues((cur) => applyChanges(cur, changed, (val) => val + 1));
  }, [changed]);

  React.useEffect(() => {
    setSequences(values, changed);
  }, [values, changed]);

  React.useEffect(() => {
    const timeout = window.setTimeout(() => {
      setValues((cur) => applyChanges(cur, sequences, () => 0));
      resetSequences();
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, [sequences, resetSequences]);

  return (
    <>
      {values.map((_value, i) => {
        const classNames = getClassNames(i).join(" ");

        return (
          <Value
            className={classNames}
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

export default App;
