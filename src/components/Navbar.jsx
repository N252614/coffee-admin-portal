import { NavLink } from "react-router-dom";

const linkStyle = ({ isActive }) => ({
  padding: "8px 14px",
  textDecoration: "none",
  borderRadius: 4,
  fontWeight: 600,
  color: "white",
  background: isActive ? "#5b3a2a" : "transparent",
  border: "1px solid rgba(255,255,255,0.3)",
  marginRight: 10,
});

export default function Navbar() {
  return (
    <nav style={{
      display: "flex",               
      justifyContent: "center",      
      alignItems: "center",          
      padding: "12px 20px",
      background: "#7a4b35",
      position: "sticky",
      top: 0,
      zIndex: 1000
    }}>
      <NavLink to="/" style={linkStyle}>Home</NavLink>
      <NavLink to="/shop" style={linkStyle}>Shop</NavLink>
      <NavLink to="/admin" style={linkStyle}>Admin Portal</NavLink>
    </nav>
  );
}