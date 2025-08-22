import React from "react";
import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Admin from "../Admin.jsx";

beforeEach(() => {
  vi.restoreAllMocks();

  // Default mock: POST succeeds and returns a new id
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ id: 999 }),
  });
});

afterEach(() => cleanup());

/** Helper: render Admin inside a Router */
function renderWithRouter(ui) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe("Admin page", () => {
  it("renders form fields and the submit button", () => {
    renderWithRouter(<Admin />);

    // If your Admin.jsx uses <label htmlFor="..."> — keep getByLabelText.
    // If it uses only placeholders — replace with getByPlaceholderText.
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Origin/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Price/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /add product/i })
    ).toBeInTheDocument();
  });

  it("submits the form with POST and clears inputs on success", async () => {
    renderWithRouter(<Admin />);

    const nameInput = screen.getByLabelText(/Name/i);
    const descInput = screen.getByLabelText(/Description/i);
    const originInput = screen.getByLabelText(/Origin/i);
    const priceInput = screen.getByLabelText(/Price/i);

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Brazilian Roast");

    await userEvent.clear(descInput);
    await userEvent.type(descInput, "Medium Roast, smooth and chocolatey");

    await userEvent.clear(originInput);
    await userEvent.type(originInput, "Brazil");

    await userEvent.clear(priceInput);
    await userEvent.type(priceInput, "15");

    await userEvent.click(
      screen.getByRole("button", { name: /add product/i })
    );

    // Ensure POST was called
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [url, options] = global.fetch.mock.calls[0];

    // Should target the coffee collection
    expect(url).toMatch(/\/coffee$/);

    // Should be a JSON POST
    expect(options.method).toBe("POST");
    expect(options.headers["Content-Type"]).toBe("application/json");

    const body = JSON.parse(options.body);
    expect(body).toMatchObject({
      name: "Brazilian Roast",
      description: "Medium Roast, smooth and chocolatey",
      origin: "Brazil",
    });
    // If your component casts price to a number:
    // expect(body.price).toBe(15);

    // After success the form should be cleared
    await waitFor(() => {
      expect(nameInput).toHaveValue("");
      expect(descInput).toHaveValue("");
      expect(originInput).toHaveValue("");
      // For type="number" an empty field reports "" in Testing Library
      expect(priceInput.value === "" || priceInput.value === null).toBe(true);
    });
  });
});