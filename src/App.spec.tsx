import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rows, columns } from "./config";
import App from "./App";
import _ from "lodash";
import { vi } from "vitest";

vi.mock("./config", () => ({
  rows: 5,
  columns: 5,
}));

function setup() {
  render(<App />);
}

const firstRow = _.range(0, columns).map((column) => `0-${column}`);
const firstColumn = _.range(0, rows).map((row) => `${row}-0`);

describe("App", () => {
  it("updates values in the same row and column", async () => {
    setup();
    const button = screen.getByTestId(firstRow[0]);
    userEvent.click(button);
    await waitFor(() => {
      [...firstRow, ...firstColumn].forEach((testId) => {
        expect(screen.getByTestId(testId).innerHTML).toEqual("1");
        expect(screen.getByTestId(testId).className).toEqual("highlighted");
      });
    });
  });
});
