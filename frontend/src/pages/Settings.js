import React, { useState, useEffect } from "react";
import "./Settings.css";
import { Link } from "react-router-dom";
import globeLogo from "../assets/globe.png";
import bookmark_Icon from "../assets/bookmark_Icon.png";
import settings_Icon from "../assets/settings_Icon.png";
import calandar_Icon from "../assets/calandar_Icon.png";
import archive_Icon from "../assets/archive_Icon.png";
import profile_Icon from "../assets/profile_Icon.png";

const Settings = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [lightMode, setLightMode] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [textSize, setTextSize] = useState(16);
  const [saved, setSaved] = useState(false);

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  useEffect(() => {
    // Load saved values from localStorage
    const storedFirstName = localStorage.getItem("firstName") || "";
    const storedLastName = localStorage.getItem("lastName") || "";
    setFirstName(storedFirstName);
    setLastName(storedLastName);

    const storedTheme = localStorage.getItem("theme") || "dark";
    setLightMode(storedTheme === "light");
    setDarkMode(storedTheme === "dark");
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem("firstName", firstName);
    localStorage.setItem("lastName", lastName);
    setSaved(true)
   
  };

  return (
    <div className="Settings">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        <button className="collapse-btn" onClick={toggleSidebar}>
          {sidebarCollapsed ? "→" : "←"}
        </button>
        <div className="sidebar-user">
          <img src={profile_Icon} alt="User" className="user-icon" />
          {!sidebarCollapsed && <p>User Name</p>}
        </div>
        <div className="sidebar-links">
          <Link to="/Settings" className="sidebar-link">
            <img src={settings_Icon} alt="Settings" className="sidebar-icon" />
            {!sidebarCollapsed && <span>Settings</span>}
          </Link>
          <Link to="/favorites" className="sidebar-link-fav">
            <img
              src={bookmark_Icon}
              alt="favorites"
              className="sidebar-icon-fav"
            />
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
      </div>

      {/*Header section */}
      <div className="main-panel">
        <div className="top-nav">
          <Link to="/">
            <img src={globeLogo} alt="Planora Logo" className="nav-logo" />
          </Link>
          <div className="nav-links">
            <Link to="/about">About Us</Link>
            <Link to="/resources">Resources</Link>
            <div className="account-wrapper" onClick={toggleDropdown}>
              <button className="account-btn">
                <span>My Account</span> ⌄
              </button>
              {dropdownOpen && (
                <div className="account-dropdown">
                  <Link to="/profile">Profile</Link>
                  <Link to="/Settings">Settings</Link>
                  <Link to="/login">Logout</Link>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Settings Portion */}
        <h1 className="settings-title">Settings</h1>

        {/* Profile settings */}
        <h2 className="sub-title">Profile</h2>
        <div className="profile-section">
          <form
            onSubmit={handleSave}
            style={{ display: "flex", alignItems: "center", gap: "15px" }}
          >
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <button type="submit" className="save-btn">
              Save
            </button>
          </form>
          {saved && <div className="success-message">Profile saved!</div>}
          <h3 className="sub-title3">Photo</h3>
          <div className="profile-photo">
            <img src={profile_Icon} alt="Profile" />
            <button>Change</button>
            <button>Remove</button>
          </div>
        </div>

        {/*Appearance Section */}
        <h2 className="sub-title">Appearance</h2>
        <div className="appearance-section">
          <label>Ligt Mode</label>
          <input
            type="radio"
            name="theme"
            value="light"
            checked={lightMode}
            onChange={() => {
              setLightMode(true);
              setDarkMode(false);
              localStorage.setItem("theme", "light");
            }}
          />
          <label>Dark Mode</label>
          <input
            type="radio"
            name="theme"
            value="dark"
            checked={darkMode}
            onChange={() => {
              setLightMode(false);
              setDarkMode(true);
              localStorage.setItem("theme", "dark");
            }}
          />
        </div>

        {/* Accessibility Section */}
        <h2 className="sub-title">Accessibility</h2>
        <div className="accessibility-section">
          <label>Text Size</label>
          <span className="slider-label">A</span>
          <input
            type="range"
            min="12"
            max="24"
            value={textSize}
            onChange={(e) => setTextSize(e.target.value)}
          />
          <span className="slider-label" style={{ fontSize: "24px" }}>
            A
          </span>
          <label>Text Preview</label>
          <p className="text-preview" style={{ fontSize: `${textSize}px` }}>
            Hello, Welcome to Planora!
          </p>
        </div>

        {/* Account buttons */}
        <div className="settings-buttons">
          <button className="sign-out">Sign Out</button>
          <button className="delete-account">Delete Account</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
