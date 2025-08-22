import React from "react";
import { render, screen } from "@testing-library/react";
import { test, expect } from "vitest";

// Simple test component
function Hello() {
  return <h1>Hello World</h1>;
}

test("renders Hello World", () => {
  render(<Hello />);
  // thanks to jest-dom we can use toBeInTheDocument
  expect(screen.getByText("Hello World")).toBeInTheDocument();
});