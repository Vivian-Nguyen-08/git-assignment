import React, {useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import "./App.css";
import globeLogo from "./assets/globe.png";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Files from "./pages/Files";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import EventPage from "./pages/EventPage";
import Favorites from "./pages/Favorites";
import CalendarPage from "./pages/CalendarPage";
import SupportPage from "./pages/SupportPage";
import ArchivePage from "./pages/ArchivePage";

// Contexts
import { FavoritesProvider } from "./context/FavoritesContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { ArchiveProvider } from "./context/ArchiveContext";

// 🏠 Home Component
function Home() {
  return (
    <div className="app">
      <div className="stars"></div>
      <div className="top-right">
        <div className="nav-links">
          <Link to="/about">About Us</Link>
          <Link to="/resources">Resources</Link>
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

// 🌐 App Routes Component with props
function AppRoutes({ customGroups, setCustomGroups }) {
  // eslint-disable-next-line no-unused-vars
  const { isDarkMode } = useTheme();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/dashboard"
        element={
          <Dashboard
            customGroups={customGroups}
            setCustomGroups={setCustomGroups}
          />
        }
      />
      <Route path="/settings" element={<Settings />} />
      <Route path="/files" element={<Files />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route
        path="/calendar"
        element={
          <CalendarPage
            customGroups={customGroups}
            setCustomGroups={setCustomGroups}
          />
        }
      />
      <Route path="/support" element={<SupportPage />} />
      <Route path="/event/:id" element={<EventPage />} />
    </Routes>
  );
}

// 🚀 Final App Component with Providers and dark mode handling
function ThemedApp() {
  const { isDarkMode } = useTheme();
  const [customGroups, setCustomGroups] = useState([]);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  return (
    <Router>
      <AppRoutes
        customGroups={customGroups}
        setCustomGroups={setCustomGroups}
      />
    </Router>
  );
}

// 🚀 Final App Component with Providers and lifted state
function App() {
  const [customGroups, setCustomGroups] = useState([]);

  return (
    <ArchiveProvider>
      <FavoritesProvider>
        <ThemeProvider>
          <Router>
            <AppRoutes
              customGroups={customGroups}
              setCustomGroups={setCustomGroups}
            />
          </Router>
        </ThemeProvider>
      </FavoritesProvider>
      </ArchiveProvider>
  );
}

export default App;