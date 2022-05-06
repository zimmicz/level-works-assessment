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
  getInitialValues,
  getValuesToChange,
  shouldIBreakLine,
} from "./utils";

function App() {
  const [values, setValues] = React.useState(getInitialValues);
  const [changed, setChanged] = useHighlight();

  const handleCellClick = (value: number) => () => {
    const valuesToChange = getValuesToChange(value);
    setValues((cur) => applyChanges(cur, valuesToChange));
    setChanged(valuesToChange);
  };

  React.useEffect(() => {
    console.log("values", values);
  }, [values]);

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

export default App;
