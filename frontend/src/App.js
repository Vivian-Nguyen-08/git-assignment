import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import globeLogo from "./assets/globe.png";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import EventPage from "./pages/EventPage";
import Favorites from "./pages/Favorites";
import CalendarPage from "./pages/CalendarPage";
import { FavoritesProvider } from "./context/FavoritesContext";

// Home Component (Landing page)
function Home() {
  return (
    <div className="app">
      <div className="stars"></div>

      <div className="top-right">
        <div className="nav-links">
          <a href="/about">About Us</a>
          <a href="/resources">Resources</a>
          <Link to="/login">
            <button className="login-btn">Log In</button>
          </Link>
        </div>
      </div>

      <div className="hero">
        <img src={globeLogo} alt="Planora Logo" className="logo-image" />
        <h2 className="tagline" style={{ marginBottom: 50 }}>
          Plan Your Events with Ease!
        </h2>
      </div>

      <footer>
        <p>Planora &copy; 2025</p>
      </footer>
    </div>
  );
}

// Main App Component
function App() {
  const [customGroups, setCustomGroups] = useState([]); // Shared state for events

  return (
    <FavoritesProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/event/:id" element={<EventPage />} />
          <Route
            path="/calendar"
            element={
              <CalendarPage
                customGroups={customGroups}
                setCustomGroups={setCustomGroups}
              />
            }
          />
        </Routes>
      </Router>
    </FavoritesProvider>
  );
}

export default App;
