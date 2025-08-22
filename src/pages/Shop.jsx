import React from "react";
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";

const API = "http://localhost:3001";

export default function Shop() {
  // Local UI state
  const [products, setProducts] = useState([]);   // all products from server
  const [query, setQuery] = useState("");         // search text
  const [loading, setLoading] = useState(true);   // loading flag
  const [error, setError] = useState(null);       // error message

  // Load data on mount
  useEffect(() => {
    fetch(`${API}/coffee`)
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
        setLoading(false);
      });
  }, []);

  // Delete a product by id (optimistic UI)
  async function handleDelete(id) {
    const ok = window.confirm("Delete this product?");
    if (!ok) return;

    // 1) Optimistic UI: remove from state immediately
    setProducts((prev) => prev.filter((p) => p.id !== id));

    try {
      // 2) Tell the server to delete
      await fetch(`${API}/coffee/${id}`, { method: "DELETE" });
      // json-server returns {}; nothing else to do.
    } catch (err) {
      console.error("Failed to delete:", err);
      alert("Could not delete. Restoring list…");
      // Fallback: re-fetch to restore if deletion failed
      fetch(`${API}/coffee`).then((r) => r.json()).then(setProducts);
    }
  }

  // Filter items by search query (case-insensitive)
  const visible = products.filter((p) => {
    const text = (p.name + " " + p.description + " " + p.origin).toLowerCase();
    return text.includes(query.toLowerCase());
  });

  if (loading) return <p style={{ padding: 16 }}>Loading products...</p>;
  if (error)   return <p style={{ padding: 16, color: "crimson" }}>{error}</p>;

  return (
    <main style={{ padding: 16 }}>
      <h2>Shop</h2>

      {/* Search input */}
      <div style={{ marginTop: 8, marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search coffee..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: "100%",
            maxWidth: 380,
            padding: "10px 12px",
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* Grid with product cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        {visible.map((item) => (
          <ProductCard
            key={item.id}
            item={item}
            onDelete={handleDelete}  // pass delete handler to the card
          />
        ))}
      </div>

      {/* Empty state */}
      {visible.length === 0 && (
        <p style={{ marginTop: 16 }}>No products found.</p>
      )}
    </main>
  );
}