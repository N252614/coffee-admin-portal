import React from "react";
import { describe, it, beforeEach, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import Shop from "../Shop.jsx";

// ----- Fake test data for mocking the server -----
const products = [
  { id: "1", name: "Vanilla Bean", description: "Medium Roast", origin: "Colombia", price: 10 },
  { id: "2", name: "House Blend", description: "Dark Roast", origin: "Vietnam", price: 12 },
  { id: "3", name: "Ethiopian Sunrise", description: "Light Roast", origin: "Ethiopia", price: 14 },
];

// Replace the global fetch function with a mock
vi.stubGlobal("fetch", vi.fn());

beforeEach(() => {
  // Mock window.confirm so it always returns true (user confirmed deletion)
  vi.spyOn(window, "confirm").mockReturnValue(true);

  // Reset fetch before each test and define default behavior
  fetch.mockReset();
  fetch.mockImplementation(async (url, options = {}) => {
    // GET request returns our fake products
    if (!options.method || options.method === "GET") {
      return { ok: true, json: async () => products };
    }
    // DELETE request always succeeds
    if (options.method === "DELETE") {
      return { ok: true, json: async () => ({}) };
    }
    return { ok: true, json: async () => ({}) };
  });
});

describe("Shop page", () => {
  it("filters products by search query", async () => {
    render(
      <MemoryRouter>
        <Shop />
      </MemoryRouter>
    );

    // Wait for the first product to appear
    expect(await screen.findByText(/Vanilla Bean/i)).toBeInTheDocument();

    // Type "house" into the search input
    const input = screen.getByPlaceholderText(/search coffee/i);
    await userEvent.clear(input);
    await userEvent.type(input, "house");

    // Vanilla Bean should disappear, House Blend should be visible
    await waitFor(() => {
      expect(screen.queryByText(/Vanilla Bean/i)).not.toBeInTheDocument();
      expect(screen.getByText(/House Blend/i)).toBeInTheDocument();
    });
  });

  it("removes a product after clicking Delete", async () => {
    render(
      <MemoryRouter>
        <Shop />
      </MemoryRouter>
    );

    // Wait for products to load
    expect(await screen.findByText(/Vanilla Bean/i)).toBeInTheDocument();

    // Click the Delete button on the first product
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    await userEvent.click(deleteButtons[0]);

    // Optimistic UI: Vanilla Bean should disappear from the screen
    await waitFor(() => {
      expect(screen.queryByText(/Vanilla Bean/i)).not.toBeInTheDocument();
    });

    // Ensure DELETE was called with correct URL
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/coffee\/1$/),
      expect.objectContaining({ method: "DELETE" })
    );
  });
});