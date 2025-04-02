import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

import globeLogo from "../assets/globe.png";
import bookmark_Icon from "../assets/bookmark_Icon.png";
import settings_Icon from "../assets/settings_Icon.png";
import calandar_Icon from "../assets/calandar_Icon.png";
import archive_Icon from "../assets/archive_Icon.png";
import profile_Icon from "../assets/profile_Icon.png";
import emptySave_Icon from "../assets/emptySave_Icon.png";
import filledSave_Icon from "../assets/filledSave_Icon.png";

import GroupPopup from "./GroupPopup";
import { useFavorites } from "../context/FavoritesContext";

const dummyEvents = [
  { id: 1, name: "Beach Bonfire Bash", img: "https://images.unsplash.com/photo-1552083375-1447ce886485?fm=jpg&q=60&w=3000" },
  { id: 2, name: "Sunset Hike & Chill", img: "https://images.unsplash.com/photo-1698138819865-88d3add4838f?fm=jpg&q=60&w=3000" },
  { id: 3, name: "Green Hillside Picnic", img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?fm=jpg&q=60&w=3000" },
  { id: 4, name: "Mountain Lake Gathering", img: "https://images.unsplash.com/photo-1552083375-1447ce886485?fm=jpg&q=60&w=3000" },
  { id: 5, name: "Dunes and Sunsets", img: "https://images.unsplash.com/photo-1698138819865-88d3add4838f?fm=jpg&q=60&w=3000" },
  { id: 6, name: "Forest Retreat", img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?fm=jpg&q=60&w=3000" }
];

const Dashboard = ({ customGroups = [], setCustomGroups }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showGroupPopup, setShowGroupPopup] = useState(false);
  const { toggleFavorite, isFavorited } = useFavorites();
  const navigate = useNavigate();

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
      completed: false
    };

    setCustomGroups((prev) => [...prev, groupWithDefaults]);
    navigate("/calendar");
  };

<<<<<<< HEAD
  const filteredCustomEvents = (customGroups || [])
    .filter(group => group.type === "event")
    .map((group) => ({
      id: group.id,
=======
  const firstName = localStorage.getItem("firstName") || "User";
  const lastName = localStorage.getItem("lastName") || "Name";

  const allEvents = [
    ...dummyEvents,
    ...customGroups.map((group, i) => ({
      id: `custom-${i}`,
>>>>>>> origin/settings
      name: group.name,
      img: group.img,
      description: group.description,
      fromDate: group.fromDate,
      toDate: group.toDate,
      invites: group.invites
    }));

  const allEvents = [...dummyEvents, ...filteredCustomEvents];

  return (
    <div className="dashboard">
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
          <Link to="/Settings" className="sidebar-link">
            <img src={settings_Icon} alt="settings" className="sidebar-icon" />
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
                My Account ⌄
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

        <h1 className="events-title">My Events</h1>

        <div className="events-grid-scroll">
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
                        src={
                          isFavorited(event.id)
                            ? filledSave_Icon
                            : emptySave_Icon
                        }
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
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="add-button" onClick={() => setShowGroupPopup(true)}>
          ＋
        </div>

        {showGroupPopup && (
          <GroupPopup
            onClose={() => setShowGroupPopup(false)}
            onCreate={handleCreateGroup}
          />
        )}

        <footer className="dashboard-footer">
          <div>Planora</div>
          <div>Support</div>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
