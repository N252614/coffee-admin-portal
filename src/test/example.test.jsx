import React from "react";
import "@testing-library/jest-dom/vitest";

import { render, screen } from "@testing-library/react";
import { test, expect } from "vitest";

function Hello() {
  return <h1>Hello World</h1>;
}

test("renders Hello World", () => {
  render(<Hello />);
  expect(screen.getByText("Hello World")).toBeInTheDocument();
});