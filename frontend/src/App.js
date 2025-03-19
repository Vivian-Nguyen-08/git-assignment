import React from "react";
import "./App.css";
import globeLogo from "./assets/globe.png"; // Import the Planora logo

function App() {
  return (
    <div className="app">
      {/* Starry Background */}
      <div className="stars"></div>

      {/* Navigation Bar */}
      <nav className="navbar">
        <h1 className="logo">Planora</h1>
        <div className="nav-links">
          <a href="#about">About Us</a>
          <a href="#resources">Resources</a>
          <button className="login-btn">Log In</button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero">
        <img src={globeLogo} alt="Planora Logo" className="logo-image" />
        <h2 className="tagline">Plan Your Events with Ease!</h2>
      </div>

      {/* Footer */}
      <footer>
        <p>Planora &copy; 2025</p>
      </footer>
    </div>
  );
}

export default App;
