import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL, jsonFetch } from "../services/api.js";

export default function Admin() {
  // Controlled form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [origin, setOrigin] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState(null); // success/error message
  const navigate = useNavigate();

  const isValid = name && description && origin && price !== "";

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isValid) {
      setStatus("Please fill in all fields.");
      return;
    }

    const newItem = {
      name,
      description,
      origin,
      price: Number(price)
    };

    try {
      // Send POST request to the fake backend
      await jsonFetch(`${BASE_URL}/coffee`, {
        method: "POST",
        body: JSON.stringify(newItem),
      });

      setStatus("Product added!");
      // Clear form
      setName(""); setDescription(""); setOrigin(""); setPrice("");

      // Redirect to shop to see the new card
      setTimeout(() => navigate("/shop"), 600);
    } catch (err) {
      console.error(err);
      setStatus("Failed to add product.");
    }
  }

  return (
    <main style={{ padding: 16 }}>
      <h2>Admin Portal</h2>

      <form onSubmit={handleSubmit} style={{
        maxWidth: 420, marginTop: 12,
        background: "#fff", padding: 16,
        borderRadius: 8, border: "1px solid #ddd"
      }}>
        <label style={{ display: "block", marginBottom: 8 }}>
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </label>

        <label style={{ display: "block", marginBottom: 8 }}>
          Description
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </label>

        <label style={{ display: "block", marginBottom: 8 }}>
          Origin
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </label>

        <label style={{ display: "block", marginBottom: 12 }}>
          Price (USD)
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </label>

        <button
          type="submit"
          disabled={!isValid}
          style={{
            padding: "10px 14px",
            borderRadius: 6,
            border: "none",
            background: "#7a4b35",
            color: "white",
            fontWeight: 600,
            cursor: "pointer",
            opacity: isValid ? 1 : 0.6
          }}
        >
          Add Product
        </button>

        {status && <p style={{ marginTop: 10 }}>{status}</p>}
      </form>
    </main>
  );
}