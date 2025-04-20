import React, { useEffect, useState, useRef, useCallback } from "react";
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
import { useArchive } from "../context/ArchiveContext";

const Dashboard = ({ customGroups = [], setCustomGroups }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showGroupPopup, setShowGroupPopup] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [userGroups, setGroups] = useState([]);
  const [profileImage, setProfileImage] = useState(null); // NEW

  const { toggleFavorite, isFavorited } = useFavorites();
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const refreshGroups = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const firstName = localStorage.getItem("firstName") || "User";
  const lastName = localStorage.getItem("lastName") || "Name";

  const { archiveEvent, isArchived } = useArchive();
  const [confirmArchive, setConfirmArchive] = useState(null);
  const [invitedGroups, setInvitedGroups] = useState([]);

  const handleCreateGroup = (newGroup) => {
    const groupWithDefaults = {
      id: newGroup.id || Date.now().toString(),
      name: newGroup.name,
      description: newGroup.description || "",
      fromDate: newGroup.fromDate,
      toDate: newGroup.toDate,
      members: newGroup.members || [],
      img: newGroup.img || "https://via.placeholder.com/300x200",
      type: "event",
      completed: false,
    };

    setCustomGroups((prev) => [...prev, groupWithDefaults]);
    refreshGroups();
    setShowGroupPopup(false);
  };

  useEffect(() => {
    const fetchGroups = async () => {
      const token = localStorage.getItem("access_token");
      const tokenType = localStorage.getItem("token_type") || "bearer";

      try {
        const response = await api.get("/group/my-groups/", {
          headers: {
            Authorization: `${tokenType} ${token}`,
          },
        });

        setGroups(response.data.groups || []);
        setInvitedGroups(response.data.invited_groups || []);
      } catch (err) {
        console.error("Failed to fetch groups", err);
      }
    };

    fetchGroups();
  }, []);

  useEffect(() => {
    const storedImage = localStorage.getItem("profileImage"); // NEW
    if (storedImage) {
      setProfileImage(storedImage);
    }
  }, []);

  const allEvents = [
    ...customGroups.map((group) => ({
      ...group,
      img: group.img || "https://via.placeholder.com/300x200",
    })),
    ...userGroups.map((group) => ({
      ...group,
      img: group.img || "https://via.placeholder.com/300x200",
      type: "event",
    })),
  ];

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        <button className="collapse-btn" onClick={toggleSidebar}>
          {sidebarCollapsed ? "→" : "←"}
        </button>
        <div className="sidebar-user">
          <img
            src={profileImage || profile_Icon}
            alt="User"
            className="user-icon"
          />
          {!sidebarCollapsed && (
            <p>
              {firstName} {lastName}
            </p>
          )}
        </div>
        <div className="sidebar-links">
          <Link to="/settings" className="sidebar-link">
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
              <button className="account-btn">My Account ⌄</button>
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
            {userGroups.length === 0 ? (
              <p className="no-events-msg">You're not in any groups yet.</p>
            ) : (
              allEvents
                .filter(
                  (event) => event.type !== "task" && !isArchived(event.id)
                )
                .map((event, index) => (
                  <Link
                    to={`/event/${event.id}`}
                    key={event.id || index}
                    className="event-card-link"
                    onClick={() =>
                      localStorage.setItem("currentEventId", event.id)
                    }
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
                          className="archive-btn"
                          onClick={(e) => {
                            e.preventDefault();
                            setConfirmArchive(event);
                          }}
                        >
                          <img
                            src={archive_Icon}
                            alt="Archive Icon"
                            className="archive-icon"
                          />
                        </button>

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
                        {event.type && (
                          <span className={`event-type-badge ${event.type}`}>
                            {event.type.charAt(0).toUpperCase() +
                              event.type.slice(1)}
                            {event.type === "task" && event.completed
                              ? " ✅"
                              : ""}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))
            )}
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

        {confirmArchive && (
          <div className="popup-overlay">
            <div className="popup-box">
              <p>Are you sure you want to archive "{confirmArchive.name}"?</p>
              <div className="popup-actions">
                <button
                  className="confirm-btn"
                  onClick={() => {
                    archiveEvent(confirmArchive);
                    setConfirmArchive(null);
                  }}
                >
                  Yes
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => setConfirmArchive(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
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
