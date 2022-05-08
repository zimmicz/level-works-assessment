import React from "react";
import { columns, rows } from "./config";
import { useFibonacci, useHighlight } from "./hooks";
import "./index.css";
import type { Position } from "./types";
import {
  applyChanges,
  columnAndRowMatcher,
  columnOrRowMatcher,
  getInitialValues,
} from "./utils";

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

  const getClassNames = (position: Position) =>
    [
      changed && columnOrRowMatcher(changed)(position)
        ? "highlighted"
        : undefined,
      sequences && sequences.find((pos) => columnAndRowMatcher(pos)(position))
        ? "cleared"
        : undefined,
    ]
      .filter(Boolean)
      .join(" ");

  React.useEffect(() => {
    if (!changed) {
      return;
    }

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
      setValues((oldValues) => {
        const newValues = oldValues;
        sequences.forEach((position) => {
          newValues[position.row][position.column] = 0;
        });

        return newValues;
      });
      resetSequences();
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, [sequences, resetSequences]);

  return (
    <>
      {values.map((row, i) => {
        return (
          <React.Fragment key={i}>
            {row.map((column, j) => {
              const classNames = getClassNames({ row: i, column: j });
              return (
                <Value
                  data-testid={`${i}-${j}`}
                  className={classNames}
                  key={`${i}-${j}`}
                  onClick={handleCellClick({ row: i, column: j })}
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

function Value({ ...rest }: React.HTMLAttributes<HTMLButtonElement>) {
  return <button {...rest} />;
}

export default App;
