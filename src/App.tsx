/*
"Create a grid of 50x50. When you click on a cell, all values in the
cells in the same row and column are increased  by 1. If a cell is
empty, it will get a value of 1. After each change a cell will briefly
turn yellow. If 5 consecutive numbers in the Fibonacci sequence
are next to each other, these cells will briefly turn green and will
be cleared. Use the programming language of your choice."
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
  const [sequences, setSequences, reset] = useFibonacci();

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
      reset();
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, [sequences, reset]);

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
