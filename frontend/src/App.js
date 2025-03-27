import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import globeLogo from "./assets/globe.png";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import EventPage from "./pages/EventPage";
import Favorites from "./pages/Favorites"; // ✅ Add this
import { FavoritesProvider } from "./context/FavoritesContext"; // ✅ Wrap app with provider

function Home() {
  return (
    <div className="app">
      {/* Starry Background */}
      <div className="stars"></div>

      {/* Header */}
      <div className="top-right">
        <div className="nav-links">
          <a href="/about">About Us</a>
          <a href="/resources">Resources</a>
          <Link to="/login">
            <button className="login-btn">Log In</button>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="hero">
        <img src={globeLogo} alt="Planora Logo" className="logo-image" />
        <h2 className="tagline" style={{ marginBottom: 50 }}>
          Plan Your Events with Ease!
        </h2>
      </div>

      {/* Footer */}
      <footer>
        <p>Planora &copy; 2025</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <FavoritesProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/favorites" element={<Favorites />} /> {/* ✅ New favorites route */}
          <Route path="/event/:id" element={<EventPage />} />
        </Routes>
      </Router>
    </FavoritesProvider>
  );
}

export default App;
