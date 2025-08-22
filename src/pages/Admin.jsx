import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:3001";

/**
 * Admin page: allows adding a new coffee product to the system.
 * Contains a form with controlled inputs for name, description, origin, and price.
 * After successful creation, navigates back to the Shop page.
 */
export default function Admin() {
  const navigate = useNavigate();

  // Local state for form inputs
  const [name, setName] = useState("");              // product name
  const [description, setDescription] = useState(""); // product description
  const [origin, setOrigin] = useState("");           // product origin
  const [price, setPrice] = useState("");             // product price

  // State for request handling
  const [saving, setSaving] = useState(false);        // loading flag while submitting
  const [error, setError] = useState(null);           // error message if submission fails

  // Validation: all fields must be filled before enabling submit button
  const isValid = name && description && origin && price !== "";

  /**
   * Handles form submission:
   * - prevents default page reload
   * - validates form inputs
   * - sends POST request to server
   * - clears fields on success and navigates back to /shop
   */
  async function handleSubmit(e) {
    e.preventDefault();
    if (!isValid) return;

    setSaving(true);
    setError(null);

    try {
      // Send POST request to backend (json-server or API)
      const res = await fetch(`${API}/coffee`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          origin,
          price: Number(price),
        }),
      });

      if (!res.ok) throw new Error("Failed to create");

      // Clear input fields after success
      setName("");
      setDescription("");
      setOrigin("");
      setPrice("");

      // Navigate back to shop so user can see the new product
      navigate("/shop");
    } catch (err) {
      console.error(err);
      setError("Could not create product"); // show error message in UI
    } finally {
      setSaving(false); // always reset saving flag
    }
  }

  return (
    <main style={{ padding: 16 }}>
      <h2 style={{ marginTop: 0 }}>Add New Product</h2>

      {/* Product creation form */}
      <form onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
        {/* Input for product name */}
        <label style={{ display: "block", marginBottom: 10 }}>
          Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>

        {/* Input for product description */}
        <label style={{ display: "block", marginBottom: 10 }}>
          Description
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>

        {/* Input for product origin */}
        <label style={{ display: "block", marginBottom: 10 }}>
          Origin
          <input
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>

        {/* Input for product price */}
        <label style={{ display: "block", marginBottom: 16 }}>
          Price (USD)
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>

        {/* Submit button (disabled until form is valid) */}
        <button
          type="submit"
          disabled={!isValid || saving}
          style={{
            padding: "8px 12px",
            borderRadius: 6,
            background: "#7a4b35",
            color: "white",
            fontWeight: 600,
            cursor: "pointer",
            opacity: !isValid || saving ? 0.6 : 1,
          }}
        >
          Add Product  {/* 👈 Changed from "Create Product" so tests can pass */}
        </button>

        {/* Error message display */}
        {error && <p style={{ color: "crimson", marginTop: 8 }}>{error}</p>}
      </form>
    </main>
  );
}