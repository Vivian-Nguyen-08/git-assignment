import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";

// Icons
import profile_Icon from "../assets/profile_Icon.png";
import home_Icon from "../assets/home_Icon.png"; // ✅ correct home icon
import settings_Icon from "../assets/settings_Icon.png";
import bookmark_Icon from "../assets/bookmark_Icon.png";
import calandar_Icon from "../assets/calandar_Icon.png";
import archive_Icon from "../assets/archive_Icon.png";
import filledSave_Icon from "../assets/filledSave_Icon.png";
import globeLogo from "../assets/globe.png"; // ✅ Planora logo

const Favorites = () => {
  const { favoriteEvents } = useFavorites();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-user">
          <img src={profile_Icon} alt="User" className="user-icon" />
          {!sidebarCollapsed && <p>User Name</p>}
        </div>

        <div className="sidebar-links">
          <Link to="/dashboard" className="sidebar-link">
            <img src={home_Icon} alt="dashboard" className="sidebar-icon" />
            {!sidebarCollapsed && <span>Dashboard</span>}
          </Link>

          <Link to="/settings" className="sidebar-link">
            <img src={settings_Icon} alt="settings" className="sidebar-icon" />
            {!sidebarCollapsed && <span>Settings</span>}
          </Link>

          <Link to="/favorites" className="sidebar-link-fav" style={{ backgroundColor: "#cbe4f6", borderRadius: "10px" }}>
            <img src={bookmark_Icon} alt="favorites" className="sidebar-icon-fav" />
            {!sidebarCollapsed && <span>Favorites</span>}
          </Link>

          <Link to="/calendar" className="sidebar-link">
            <img src={calandar_Icon} alt="calendar" className="sidebar-icon" />
            {!sidebarCollapsed && <span>Calendar</span>}
          </Link>

          <Link to="/archive" className="sidebar-link">
            <img src={archive_Icon} alt="archive" className="sidebar-icon" />
            {!sidebarCollapsed && <span>Archive</span>}
          </Link>
        </div>

        <button className="collapse-btn" onClick={toggleSidebar}>
          {sidebarCollapsed ? "→" : "←"}
        </button>
      </div>

      {/* Main Panel */}
      <div className="main-panel">
        <div className="top-nav">
          <Link to="/">
            <img src={globeLogo} alt="Planora Logo" className="nav-logo" />
          </Link>

          <div className="nav-links">
            <Link to="/about">About Us</Link>
            <Link to="/resources">Resources</Link>
            <div className="account-wrapper">
              <button className="account-btn">
                <span>My Account</span> ⌄
              </button>
              {/* Optional dropdown */}
            </div>
          </div>
        </div>

        <h1 className="events-title">Favorites</h1>

        <div className="events-grid-scroll">
          <div className="events-grid">
            {favoriteEvents.length === 0 ? (
              <p style={{ color: "white" }}>No favorites yet!</p>
            ) : (
              favoriteEvents.map((event) => (
                <Link
                  to={`/event/${event.id}`}
                  key={event.id}
                  className="event-card-link"
                >
                  <div className="event-card">
                    <div className="image-wrapper">
                      <img src={event.img} alt="Event" />
                      <button className="bookmark-btn" disabled>
                        <img
                          src={filledSave_Icon}
                          alt="Saved"
                          className="bookmark-icon"
                        />
                      </button>
                    </div>
                    <div className="event-info">
                      <p className="event-name">{event.name || "Event Name"}</p>
                      <p className="event-location">{event.description || "Location or other info"}</p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        <footer className="dashboard-footer">
          <div>Planora</div>
          <div>Support</div>
        </footer>
      </div>
    </div>
  );
};

export default Favorites;
