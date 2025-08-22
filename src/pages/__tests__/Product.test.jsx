import React from "react";
import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Product from "../Product.jsx";

afterEach(() => cleanup());

// Helper to render <Product /> with route param :id
function renderWithRoute(initialPath = "/product/1") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/product/:id" element={<Product />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("Product page", () => {
  it("renders product details from server", async () => {
    // Mock GET /coffee/1
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          id: 1,
          name: "Vanilla Bean",
          description: "Medium Roast",
          origin: "Colombia",
          price: 10,
        }),
    });

    renderWithRoute("/product/1");

    // Wait for basic product info
    expect(await screen.findByText(/Vanilla Bean/i)).toBeInTheDocument();
    expect(screen.getByText(/Medium Roast/i)).toBeInTheDocument();
    expect(screen.getByText(/Colombia/i)).toBeInTheDocument();

    // Check price input value (there can be 2 due to double render -> take the first)
    const [priceInput] =
      screen.getAllByLabelText(/price/i) ||
      screen.getAllByPlaceholderText(/price/i);
    expect(priceInput).toHaveValue(10);

    // Assert correct URL was called (GET without options is fine)
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch.mock.calls[0][0]).toMatch(/\/coffee\/1$/);
  });

  it("allows editing price and shows the updated value", async () => {
    // 1) GET
    const getResponse = {
      ok: true,
      json: () =>
        Promise.resolve({
          id: 1,
          name: "Vanilla Bean",
          description: "Medium Roast",
          origin: "Colombia",
          price: 10,
        }),
    };
    // 2) PATCH
    const patchResponse = {
      ok: true,
      json: () => Promise.resolve({ id: 1, price: 15 }),
    };

    global.fetch = vi
      .fn()
      .mockResolvedValueOnce(getResponse)    // GET /coffee/1
      .mockResolvedValueOnce(patchResponse); // PATCH /coffee/1

    renderWithRoute("/product/1");

    // Wait initial render
    expect(await screen.findByText(/Vanilla Bean/i)).toBeInTheDocument();

    // Take the first price input if multiple exist
    const [priceInput] =
      screen.getAllByLabelText(/price/i) ||
      screen.getAllByPlaceholderText(/price/i);

    expect(priceInput).toHaveValue(10);
    await userEvent.clear(priceInput);
    await userEvent.type(priceInput, "15");

    // Click "Save Price"
    await userEvent.click(screen.getByRole("button", { name: /save price/i }));

    // Ensure PATCH was sent with correct payload
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
    const [patchUrl, patchOpts] = global.fetch.mock.calls[1];
    expect(patchUrl).toMatch(/\/coffee\/1$/);
    expect(patchOpts.method).toBe("PATCH");
    expect(patchOpts.headers["Content-Type"]).toBe("application/json");
    expect(JSON.parse(patchOpts.body)).toMatchObject({ price: 15 });

    // Input reflects updated value
    await waitFor(() => expect(priceInput).toHaveValue(15));
  });
});