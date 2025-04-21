import React, { useEffect, useState,useRef,useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import api from "../api";
import { getArchivedGroups, toggleArchiveStatus } from '../api'; 
import { getFavoriteGroups, toggleFavoriteStatus } from '../api'; 

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
  const [confirmFavorite, setConfirmFavorite] = useState(null);
  const [userGroups, setUserGroups] = useState([]);

  const [refreshTrigger, setRefreshTrigger] = useState(0);
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
    //navigate("/dashboard");
    refreshGroups();

    setShowGroupPopup(false);
  };

  

  


  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await api.get("group/my-groups/");
        console.log("Raw API Response:", response);
        console.log("API response:", response.data);

        setUserGroups(response.data.groups || []);
        setInvitedGroups(response.data.invited_groups || []);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, []);

  const handleArchiveEvent = async (event) => {
    try {
      if (event.id && typeof event.id === 'number') {
        await toggleArchiveStatus(event.id, true);
        
        setUserGroups(prevGroups => 
          prevGroups.map(group => 
            group.id === event.id ? { ...group, archived: true } : group
          )
        );

      } else {
       
        if (customGroups.some(group => group.id === event.id)) {
          setCustomGroups(prevGroups => 
            prevGroups.map(group => 
              group.id === event.id ? { ...group, archived: true } : group
            )
          );
        }
      }
      
      setConfirmArchive(null);
    } catch (error) {
      console.error("Error archiving event:", error);
      alert("Failed to archive event. Please try again.");
    }
  };


  
const handleFavoriteEvent = async (event) => {
  try {
    const currentStatus = isFavorited(event.id);
    const newStatus = !currentStatus;
    
    // Update the backend
    if (event.id && typeof event.id === 'number') {
      await toggleFavoriteStatus(event.id, newStatus);
      
      setUserGroups(prevGroups => 
        prevGroups.map(group => 
          group.id === event.id ? { ...group, favorite: newStatus } : group
        )
      );
    } else if (customGroups.some(group => group.id === event.id)) {
      setCustomGroups(prevGroups => 
        prevGroups.map(group => 
          group.id === event.id ? { ...group, favorite: newStatus } : group
        )
      );
    }
    
    // Use context to update UI state
    toggleFavorite(event);
    
    setConfirmFavorite(null);
  } catch (error) {
    console.error("Error updating favorite status:", error);
    alert("Failed to update favorite status. Please try again.");
  }
};

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
          <img src={profile_Icon} alt="User" className="user-icon" />
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

      {/* Main Content */}
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
            {allEvents
              .filter((event) => event.type !== "task" && !isArchived(event.id))
              .map((event, index) => (
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

                      {/* Archive Button – Top Left */}
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

                      {/* Bookmark Button – Top Right */}
                      <button
                        className="bookmark-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          handleFavoriteEvent(event);
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
                          {event.type === "task" && event.completed ? " ✅" : ""}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>

        <h1 className="events-title">My Groups</h1>
        <div className="events-grid-scroll">
          <div className="events-grid">
            {userGroups.length === 0 ? (
              <p className="no-events-msg">You're not in any groups yet.</p>
            ) : (
              userGroups.map((group, index) => (
                <Link
                  to={`/event/${group.id}`}
                  key={group.id || index}
                  className="event-card-link"
                  state={{
                    name: group.name,
                    description: group.description,
                    img: group.img || "https://via.placeholder.com/300x200",
                    fromDate: group.fromDate,
                    toDate: group.toDate,
                    invites: group.invites,
                  }}
                >
                  <div className="event-card">
                    <div className="image-wrapper">
                      <img
                        src={group.img || "https://via.placeholder.com/300x200"}
                        alt="Event"
                      />
                      <button
                        className="bookmark-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFavorite(group);
                        }}
                      >
                        <img
                          src={
                            isFavorited(group.id)
                              ? filledSave_Icon
                              : emptySave_Icon
                          }
                          alt="Bookmark Icon"
                          className="bookmark-icon"
                        />
                      </button>
                    </div>
                    <div className="event-info">
                      <p className="event-name">{group.name}</p>
                      <p className="event-location">
                        {group.fromDate && group.toDate
                          ? `From: ${group.fromDate} — To: ${group.toDate}`
                          : "Date not set"}
                      </p>
                      <span className="event-type-badge event">Event</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        <h1 className="events-title">Invited Groups</h1>
        <div className="events-grid-scroll">
          <div className="events-grid">
            {invitedGroups.length === 0 ? (
              <p className="no-events-msg">No invitations yet!</p>
            ) : (
              invitedGroups.map((group, index) => (
                <Link
                  to={`/event/${group.id}`}
                  key={group.id || index}
                  className="event-card-link"
                  state={{
                    name: group.name,
                    description: group.description,
                    img: group.img || "https://via.placeholder.com/300x200",
                    fromDate: group.fromDate,
                    toDate: group.toDate,
                    invites: group.invites,
                  }}
                >
                  <div className="event-card">
                    <div className="image-wrapper">
                      <img
                        src={group.img || "https://via.placeholder.com/300x200"}
                        alt="Event"
                      />
                      <button
                        className="bookmark-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFavorite(group);
                        }}
                      >
                        <img
                          src={
                            isFavorited(group.id)
                              ? filledSave_Icon
                              : emptySave_Icon
                          }
                          alt="Bookmark Icon"
                          className="bookmark-icon"
                        />
                      </button>
                    </div>
                    <div className="event-info">
                      <p className="event-name">{group.name}</p>
                      <p className="event-location">
                        {group.fromDate && group.toDate
                          ? `From: ${group.fromDate} — To: ${group.toDate}`
                          : "Date not set"}
                      </p>
                      <span className="event-type-badge invited">Invited</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
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

        {/* Archive Confirmation Popup */}
        {confirmArchive && (
          <div className="popup-overlay">
            <div className="popup-box">
              <p>Are you sure you want to archive "{confirmArchive.name}"?</p>
              <div className="popup-actions">
                <button
                  className="confirm-btn"
                  onClick={() => {
                    archiveEvent(confirmArchive);
                    handleArchiveEvent(confirmArchive);
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