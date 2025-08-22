import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const BASE_URL = "http://localhost:3001";

/**
 * Product details page with editable price.
 */
export default function Product() {
  const { id } = useParams(); // read :id from /product/:id
  const [item, setItem] = useState(null); // current product data
  const [price, setPrice] = useState(""); // editable price
  const [status, setStatus] = useState(null); // status message
  const [saving, setSaving] = useState(false); // save button state

  // Load product by id on mount/change
  useEffect(() => {
    fetch(`${BASE_URL}/coffee/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setItem(data);
        setPrice(data.price); // prefill input
      })
      .catch((err) => console.error("Failed to load product:", err));
  }, [id]);

  async function savePrice() {
    if (!item) return;
    setSaving(true);
    try {
      await fetch(`${BASE_URL}/coffee/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: Number(price) }),
      });
      setStatus("Saved!");
    } catch (e) {
      console.error(e);
      setStatus("Failed to save.");
    } finally {
      setSaving(false);
      setTimeout(() => setStatus(null), 1200);
    }
  }

  if (!item) return <p style={{ padding: 16 }}>Loading…</p>;

  return (
    <main style={{ padding: 16 }}>
      <div style={{ marginBottom: 12 }}>
        <Link to="/shop" style={{ textDecoration: "none" }}>
          ← Back to Shop
        </Link>
      </div>

      <h2 style={{ marginTop: 0 }}>{item.name}</h2>
      <p>{item.description}</p>
      <p>
        <b>Origin:</b> {item.origin}
      </p>

      <div
        style={{
          marginTop: 16,
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: 16,
          maxWidth: 380,
        }}
      >
        <label style={{ display: "block", marginBottom: 10 }}>
          Price (USD)
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>

        <button
          onClick={savePrice}
          disabled={saving}
          style={{
            padding: "8px 12px",
            borderRadius: 6,
            background: "#7a4b35",
            color: "white",
            fontWeight: 600,
            cursor: "pointer",
            opacity: saving ? 0.6 : 1,
          }}
        >
          Save Price
        </button>
        {status && <span style={{ marginLeft: 12 }}>{status}</span>}
      </div>
    </main>
  );
}