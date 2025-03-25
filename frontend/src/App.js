import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css"; // Ensure your CSS file is correctly linked
import globeLogo from "./assets/globe.png"; // Import Planora logo
import Login from "./pages/Login"; // Import the Login page
import Signup from "./pages/Signup";

function Home() {
  return (
    <div className="app">
      {/* Starry Background */}
      <div className="stars"></div>
      {/* Header */}
      <div className="top-right">
        <div className="nav-links">
          <a href="#about">About Us</a>
          <a href="#resources">Resources</a>
          <Link to="/login">
            <button className="login-btn">Log In</button>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="hero">
        <img src={globeLogo} alt="Planora Logo" className="logo-image" />
        <h2 className="tagline" style={{ marginBottom: 50 }}>Plan Your Events with Ease!</h2>
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
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
