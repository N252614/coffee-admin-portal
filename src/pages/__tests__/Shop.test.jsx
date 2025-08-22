import React from "react";
import { describe, it, beforeEach, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import Shop from "../Shop.jsx";

// ---- Test data ----
const products = [
  { id: "1", name: "Vanilla Bean", description: "Medium Roast", origin: "Colombia", price: 10 },
  { id: "2", name: "House Blend", description: "Dark Roast", origin: "Vietnam", price: 12 },
  { id: "3", name: "Ethiopian Sunrise", description: "Light Roast", origin: "Ethiopia", price: 14 },
];

// Use a single global fetch mock for all tests
vi.stubGlobal("fetch", vi.fn());

beforeEach(() => {
  // Reset mock calls and provide default implementation:
  // - GET /coffee  -> returns the list
  // - DELETE /coffee/:id -> ok:true
  fetch.mockReset();
  fetch.mockImplementation(async (url, options) => {
    if (!options || !options.method || options.method === "GET") {
      return { ok: true, json: async () => products };
    }
    if (options.method === "DELETE") {
      return { ok: true, json: async () => ({}) };
    }
    return { ok: true, json: async () => ({}) };
  });
});

describe("Shop page", () => {
  it("filters products by search query", async () => {
    // Render Shop inside a MemoryRouter (ProductCard uses <Link>)
    render(
      <MemoryRouter>
        <Shop />
      </MemoryRouter>
    );

    // Wait for first item to appear
    expect(await screen.findByText(/Vanilla Bean/i)).toBeInTheDocument();

    // Type into the search field
    const input = screen.getByPlaceholderText(/search coffee/i);
    await userEvent.clear(input);
    await userEvent.type(input, "house");

    // Should hide "Vanilla Bean" and show "House Blend"
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

    // Wait until list is loaded
    expect(await screen.findByText(/Vanilla Bean/i)).toBeInTheDocument();

    // Click the first "Delete" button (for Vanilla Bean)
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    await userEvent.click(deleteButtons[0]);

    // Optimistic UI: "Vanilla Bean" should disappear
    await waitFor(() => {
      expect(screen.queryByText(/Vanilla Bean/i)).not.toBeInTheDocument();
    });

    // And DELETE should be called with the proper endpoint
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/coffee\/1$/),
      expect.objectContaining({ method: "DELETE" })
    );
  });
});