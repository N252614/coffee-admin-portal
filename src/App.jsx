// Main router setup for the app

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Shop from "./pages/Shop.jsx";
import Admin from "./pages/Admin.jsx";
import Product from "./pages/Product.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<h2 style={{ padding: 16 }}>Not Found</h2>} />
      </Routes>
    </BrowserRouter>
  );
}