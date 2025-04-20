import React, { useState, useEffect } from "react";
import "../styles/Settings.css";
import { Link, useNavigate } from "react-router-dom";
import globeLogo from "../assets/globe.png";
import bookmark_Icon from "../assets/bookmark_Icon.png";
import settings_Icon from "../assets/settings_Icon.png";
import calandar_Icon from "../assets/calandar_Icon.png";
import archive_Icon from "../assets/archive_Icon.png";
import profile_Icon from "../assets/profile_Icon.png";
import home_Icon from "../assets/home_Icon.png";
import { useTheme } from "../context/ThemeContext"; //  Theme Context
import api from "../api";

const Settings = () => {
  const { isDarkMode, setIsDarkMode } = useTheme(); // Global theme hook

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage") || null
  );
  const [textSize, setTextSize] = useState(16);
  const [saved, setSaved] = useState(false);

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  // Load profile & text size from localStorage
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("access_token");
      const tokenType = localStorage.getItem("token_type") || "bearer";

      if (!token) return;

      try {
        const response = await api.get("/auth/users/me", {
          headers: {
            Authorization: `${tokenType} ${token}`,
          },
        });

        const { first_name, last_name } = response.data;

        localStorage.setItem("firstName", first_name);
        localStorage.setItem("lastName", last_name);

        setFirstName(first_name);
        setLastName(last_name);
      } catch (err) {
        console.error("Failed to fetch user info", err);
      }
    };

    fetchUserInfo();

    const storedTextSize = localStorage.getItem("textSize");
    if (storedTextSize) {
      setTextSize(parseInt(storedTextSize));
      document.documentElement.style.setProperty(
        "--global-text-size",
        `${storedTextSize}px`
      );
    }
  }, []);

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const tokenType = localStorage.getItem("token_type") || "bearer";

      if (!token) {
        setError("You must be logged in to delete your account.");
        return;
      }

      // Set the Authorization header
      const config = {
        headers: {
          Authorization: `${tokenType} ${token}`,
        },
      };

      // Send DELETE request to the backend
      const response = await api.delete("auth/delete_account/", config);

      console.log("Account deletion response:", response.data);

      // Optionally clear localStorage and redirect user
      localStorage.removeItem("access_token");
      localStorage.removeItem("token_type");

      navigate("/signup"); // Redirect to  signup page
    } catch (err) {
      console.error("Account deletion failed:", err);
      if (err.message.includes("Cannot connect to server")) {
        setError(
          "Cannot connect to server. Please make sure the backend is running."
        );
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Account deletion failed. Please try again.");
      }
    }
  };

  // Theme mode toggle effect
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  const handleTextSizeChange = (e) => {
    setTextSize(e.target.value);
  };

  const handleSaveTextSize = () => {
    localStorage.setItem("textSize", textSize);
    document.documentElement.style.setProperty(
      "--global-text-size",
      `${textSize}px`
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // saving the users name to database after they update it
  const handleSave = async (e) => {
    e.preventDefault(); // Prevent form refresh

    if (!firstName.trim()) {
      setError("First Name is required");
      return;
    }

    if (!lastName.trim()) {
      setError("Last Name is required");
      return;
    }

    const token = localStorage.getItem("access_token");
    const tokenType = localStorage.getItem("token_type") || "bearer";

    try {
      const response = await api.put(
        "auth/update_user/",
        {
          name: firstName,
          last_name: lastName,
        },
        {
          headers: {
            Authorization: `${tokenType} ${token}`,
          },
        }
      );

      console.log("Name update response:", response.data);
      localStorage.setItem("firstName", firstName);
      localStorage.setItem("lastName", lastName);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Failed to update name:", err);
      setError("Failed to update name. Please try again.");
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        setError("Invalid image format");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        localStorage.setItem("profileImage", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    localStorage.removeItem("profileImage");
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
          {!sidebarCollapsed && (
            <p>
              {firstName} {lastName}
            </p>
          )}
        </div>
        <div className="sidebar-links">
          <Link to="/dashboard" className="sidebar-link">
            <img src={home_Icon} alt="home" className="sidebar-icon" />
            {!sidebarCollapsed && <span>Dashboard</span>}
          </Link>
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

      {/* Header */}
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

        {/* Settings Section */}
        <h1 className="settings-title">Settings</h1>

        {/* Profile Section */}
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
            <div className="settings-buttons">
              <button type="submit" className="save">
                Save
              </button>
            </div>
          </form>
          {saved && <div className="success-message">Profile saved!</div>}
          <h3 className="sub-title3">Photo</h3>
          <div className="profile-photo">
            <img
              src={profileImage || profile_Icon}
              alt="Profile"
              className="profile-img"
            />
            <input
              type="file"
              accept="image/*"
              id="fileInput"
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
            <button
              onClick={() => document.getElementById("fileInput").click()}
            >
              Change
            </button>
            <button onClick={handleRemoveImage}>Remove</button>
          </div>
          {error && <div className="error-message">{error}</div>}
        </div>

        {/* Appearance Section */}
        <h2 className="sub-title">Appearance</h2>
        <div className="appearance-section">
          <div className="toggle-container">
            <span>
              <label className="sub-title3">Light</label>
            </span>
            <label className="switch">
              <input
                type="checkbox"
                checked={isDarkMode}
                onChange={() => setIsDarkMode(!isDarkMode)}
              />
              <span className="slider round"></span>
            </label>
            <span>
              <label className="sub-title3">Dark</label>
            </span>
          </div>
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
            onChange={handleTextSizeChange}
          />
          <span className="slider-label" style={{ fontSize: "24px" }}>
            A
          </span>
          <label>Text Preview</label>
          <p className="text-preview" style={{ fontSize: `${textSize}px` }}>
            Hello, Welcome to Planora!
          </p>
          <div className="settings-buttons">
            <button onClick={handleSaveTextSize} className="save">
              Save
            </button>
          </div>

          {saved && <div className="success-message">Text size saved!</div>}
        </div>

        {/* Account Buttons */}
        <div className="settings-buttons">
          <button className="sign-out" onClick={() => navigate("/login")}>
            Sign Out
          </button>
          <button
            className="delete-account"
            onClick={() => setShowConfirm(true)}
          >
            Delete Account
          </button>
        </div>
      </div>
      {showConfirm && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Are you sure you want to delete your account?</h3>
            <div className="settings-buttons">
              <button onClick={handleDeleteAccount} className="delete-confirm">
                Yes, delete
              </button>
              <button onClick={() => setShowConfirm(false)} className="cancel">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
