import React from "react";
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
// import Settings from "./pages/Settings";
import EventPage from "./pages/EventPage";
import Favorites from "./pages/Favorites";
import CalendarPage from "./pages/CalendarPage";
import { FavoritesProvider } from "./context/FavoritesContext";
import SupportPage from "./pages/SupportPage";

// Home Component (Landing page)
import Settings from "./pages/Settings";
import EventPage from "./pages/EventPage";
import Favorites from "./pages/Favorites";

// Contexts
import { FavoritesProvider } from "./context/FavoritesContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";

// Home component remains the same
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

// Main App Component
// App routes
function AppRoutes() {
  const { isDarkMode, setIsDarkMode } = useTheme();

  return (
    <>
    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/files" element={<Files />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/event/:id" element={<EventPage />} />
      </Routes>
    </>
  );
}

// Final App component with all providers
function App() {
  const [customGroups, setCustomGroups] = useState([]); // Shared state for events

  return (
    <FavoritesProvider>
      <ThemeProvider>
        <Router>
          <AppRoutes />
        </Router>
      </ThemeProvider>
    </FavoritesProvider>
  );
}

export default App;
