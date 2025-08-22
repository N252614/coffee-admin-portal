import { Link } from "react-router-dom";

// ProductCard component shows product info, link to details, and delete button
export default function ProductCard({ item, onDelete }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 8,
        padding: 12,
        background: "#fff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <h3 style={{ marginTop: 0 }}>{item.name}</h3>
      <p>{item.description}</p>
      <p>
        <b>Origin:</b> {item.origin}
      </p>
      <p>
        <b>Price:</b> ${item.price}
      </p>

      {/* Buttons container */}
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        {/* Link to product details */}
        <Link
          to={`/product/${item.id}`}
          style={{
            padding: "6px 10px",
            borderRadius: 6,
            border: "1px solid #7a4b35",
            color: "#7a4b35",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          View
        </Link>

        {/* Delete button */}
        <button
          onClick={() => onDelete(item.id)}
          style={{
            padding: "6px 10px",
            borderRadius: 6,
            border: "1px solid #b3261e",
            background: "#b3261e",
            color: "white",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}