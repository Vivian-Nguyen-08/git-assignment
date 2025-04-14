import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import api from "../api";

// Assets
import globeLogo from "../assets/globe.png";
import bookmark_Icon from "../assets/bookmark_Icon.png";
import settings_Icon from "../assets/settings_Icon.png";
import calandar_Icon from "../assets/calandar_Icon.png";
import archive_Icon from "../assets/archive_Icon.png";
import profile_Icon from "../assets/profile_Icon.png";
import emptySave_Icon from "../assets/emptySave_Icon.png";
import filledSave_Icon from "../assets/filledSave_Icon.png";

// Components
import GroupPopup from "./GroupPopup";

// Context
import { useFavorites } from "../context/FavoritesContext";

// Sample Events
const dummyEvents = [
  {
    id: 1,
    name: "Beach Bonfire Bash",
    img: "https://images.unsplash.com/photo-1552083375-1447ce886485?fm=jpg&q=60&w=3000",
  },
  {
    id: 2,
    name: "Sunset Hike & Chill",
    img: "https://images.unsplash.com/photo-1698138819865-88d3add4838f?fm=jpg&q=60&w=3000",
  },
  {
    id: 3,
    name: "Green Hillside Picnic",
    img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?fm=jpg&q=60&w=3000",
  },
  {
    id: 4,
    name: "Mountain Lake Gathering",
    img: "https://images.unsplash.com/photo-1552083375-1447ce886485?fm=jpg&q=60&w=3000",
  },
  {
    id: 5,
    name: "Dunes and Sunsets",
    img: "https://images.unsplash.com/photo-1698138819865-88d3add4838f?fm=jpg&q=60&w=3000",
  },
  {
    id: 6,
    name: "Forest Retreat",
    img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?fm=jpg&q=60&w=3000",
  },
];

const Dashboard = ({ customGroups = [], setCustomGroups }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showGroupPopup, setShowGroupPopup] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");

  const { toggleFavorite, isFavorited } = useFavorites();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await api.get("auth/users/me");
        setUserData(response.data);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError("Failed to load user data");
      }
    };

    checkAuth();
  }, [navigate]);

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleCreateGroup = (newGroup) => {
    const groupWithDefaults = {
      id: Date.now().toString(),
      name: newGroup.name,
      description: newGroup.description || "",
      fromDate: newGroup.fromDate,
      toDate: newGroup.toDate,
      invites: newGroup.invites || [],
      img: newGroup.img || "https://via.placeholder.com/300x200",
      type: "event",
      completed: false,
    };

    setCustomGroups((prev) => [...prev, groupWithDefaults]);
    navigate("/dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_type");
    navigate("/login");
  };

  const allEvents = [
    ...customGroups.map((group) => ({
      ...group,
      img: group.img || "https://via.placeholder.com/300x200",
    })),
    ...dummyEvents,
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        {/* Navigation Bar */}
        <nav className="dashboard-nav">
          <div className="nav-left">
            <button className="sidebar-toggle" onClick={toggleSidebar}>
              ☰
            </button>
            <Link to="/">
              <img src={globeLogo} alt="Planora Logo" className="nav-logo" />
            </Link>
          </div>
          <div className="nav-right">
            <Link to="/about">About Us</Link>
            <Link to="/resources">Resources</Link>
            <div className="user-dropdown">
              {userData && (
                <span className="user-name">
                  {userData.name} {userData.last_name}
                </span>
              )}
              <button onClick={toggleDropdown}>▼</button>
              {dropdownOpen && (
                <div className="dropdown-content">
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="main-content">
          <div className="events-grid">
            {allEvents.map((event, index) => (
              <Link
                to={`/event/${event.id}`}
                key={event.id || index}
                className="event-card-link"
                state={{
                  name: event.name,
                  description: event.description,
                  img: event.img,
                  fromDate: event.fromDate,
                  toDate: event.toDate,
                  invites: event.invites,
                }}
              >
                <div className="event-card">
                  <div className="image-wrapper">
                    {event.img ? (
                      <img src={event.img} alt="Event" />
                    ) : (
                      <div className="event-img-placeholder" />
                    )}
                    <button
                      className="bookmark-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(event);
                      }}
                    >
                      <img
                        src={isFavorited(event.id) ? filledSave_Icon : emptySave_Icon}
                        alt="Bookmark Icon"
                        className="bookmark-icon"
                      />
                    </button>
                  </div>
                  <div className="event-info">
                    <p className="event-name">{event.name}</p>
                    <p className="event-location">
                      {event.fromDate && event.toDate
                        ? `From: ${event.fromDate} — To: ${event.toDate}`
                        : "Date not set"}
                    </p>
                    {event.type && (
                      <span className={`event-type-badge ${event.type}`}>
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        {event.type === "task" && event.completed ? " ✅" : ""}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Create Group Button */}
        <div className="add-button" onClick={() => setShowGroupPopup(true)}>
          ＋
        </div>

        {/* Group Creation Popup */}
        {showGroupPopup && (
          <GroupPopup
            onClose={() => setShowGroupPopup(false)}
            onCreate={handleCreateGroup}
          />
        )}

        {/* Footer */}
        <footer className="dashboard-footer">
          <div>Planora</div>
          <div>Support</div>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;