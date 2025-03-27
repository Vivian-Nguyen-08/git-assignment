import React, { useState } from "react";
import "./Dashboard.css";
import { Link } from "react-router-dom";
import globeLogo from "../assets/globe.png";
import bookmark_Icon from "../assets/bookmark_Icon.png";
import settings_Icon from "../assets/settings_Icon.png";
import calandar_Icon from "../assets/calandar_Icon.png";
import archive_Icon from "../assets/archive_Icon.png";
import profile_Icon from "../assets/profile_Icon.png";
import emptySave_Icon from "../assets/emptySave_Icon.png";
import filledSave_Icon from "../assets/filledSave_Icon.png";
import GroupPopup from "./GroupPopup"; // This is the new CreateGroupModal, just renamed

const dummyEvents = [
  { id: 1, name: "Beach Bonfire Bash", img: "https://images.unsplash.com/photo-1552083375-1447ce886485?fm=jpg&q=60&w=3000" },
  { id: 2, name: "Sunset Hike & Chill", img: "https://images.unsplash.com/photo-1698138819865-88d3add4838f?fm=jpg&q=60&w=3000" },
  { id: 3, name: "Green Hillside Picnic", img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?fm=jpg&q=60&w=3000" },
  { id: 4, name: "Mountain Lake Gathering", img: "https://images.unsplash.com/photo-1552083375-1447ce886485?fm=jpg&q=60&w=3000" },
  { id: 5, name: "Dunes and Sunsets", img: "https://images.unsplash.com/photo-1698138819865-88d3add4838f?fm=jpg&q=60&w=3000" },
  { id: 6, name: "Forest Retreat", img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?fm=jpg&q=60&w=3000" },
  { id: 7, name: "Seaside Spa Day", img: "https://images.unsplash.com/photo-1552083375-1447ce886485?fm=jpg&q=60&w=3000" },
  { id: 8, name: "Sunrise Yoga", img: "https://images.unsplash.com/photo-1698138819865-88d3add4838f?fm=jpg&q=60&w=3000" },
  { id: 9, name: "Outdoor Wine Tasting", img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?fm=jpg&q=60&w=3000" },
];

const Dashboard = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [savedEvents, setSavedEvents] = useState({});
  const [showGroupPopup, setShowGroupPopup] = useState(false);
  const [customGroups, setCustomGroups] = useState([]);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  const toggleBookmark = (id) => {
    setSavedEvents((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCreateGroup = (newGroup) => {
    setCustomGroups((prev) => [...prev, newGroup]);
  };

  return (
    <div className="dashboard">
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
          <Link to="/settings" className="sidebar-link">
            <img src={settings_Icon} alt="settings" className="sidebar-icon" />
            {!sidebarCollapsed && <span>Settings</span>}
          </Link>
          <Link to="/favorites" className="sidebar-link-fav">
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
            <div className="account-wrapper" onClick={toggleDropdown}>
              <button className="account-btn">
                <span>My Account</span> ⌄
              </button>
              {dropdownOpen && (
                <div className="account-dropdown">
                  <Link to="/profile">Profile</Link>
                  <Link to="/settings">Settings</Link>
                  <Link to="/login">Logout</Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <h1 className="events-title">My Events</h1>

        <div className="events-grid-scroll">
          <div className="events-grid">
            {[...dummyEvents, ...customGroups.map((group, i) => ({
              id: `custom-${i}`,
              name: group.name,
              img: "", // or use placeholder
              description: group.description
            }))].map((event, index) => (
              <Link
                to={`/event/${event.id}`}
                key={index}
                className="event-card-link"
                state={{ name: event.name }}
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
                        toggleBookmark(event.id);
                      }}
                      aria-label="Toggle Save"
                    >
                      <img
                        src={savedEvents[event.id] ? filledSave_Icon : emptySave_Icon}
                        alt="Bookmark Icon"
                        className="bookmark-icon"
                      />
                    </button>
                  </div>
                  <div className="event-info">
                    <p className="event-name">{event.name}</p>
                    <p className="event-location">{event.description || "Location or other information"}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="add-button" onClick={() => setShowGroupPopup(true)}>＋</div>

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
