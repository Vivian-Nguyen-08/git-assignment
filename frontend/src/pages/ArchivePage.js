import React, { useState, useEffect} from "react";
import { Link } from "react-router-dom";
import "../styles/Dashboard.css";
import { getArchivedGroups, toggleArchiveStatus } from '../api'; 

// Assets
import globeLogo from "../assets/globe.png";
import bookmark_Icon from "../assets/bookmark_Icon.png";
import settings_Icon from "../assets/settings_Icon.png";
import calandar_Icon from "../assets/calandar_Icon.png";
import archive_Icon from "../assets/archive_Icon.png";
import profile_Icon from "../assets/profile_Icon.png";
import home_Icon from "../assets/home_Icon.png";

// Context
import { useArchive } from "../context/ArchiveContext";

const ArchivePage = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [confirmUnarchive, setConfirmUnarchive] = useState(null); // ✅ new
  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);
  const [customGroups, setCustomGroups] = useState([]);

  const { archivedEvents, unarchiveEvent } = useArchive();
  const firstName = localStorage.getItem("firstName") || "User";
  const lastName = localStorage.getItem("lastName") || "Name";

  const [archivedUserGroups, setArchivedUserGroups] = useState([]);

  const archivedCustomGroups = customGroups?.filter(group => group.archived) || [];


  useEffect(() => {
    const fetchArchivedGroups = async () => {
      try {
        const response = await getArchivedGroups();
        console.log("Archived groups response:", response);
        setArchivedUserGroups(response.archived_groups || []);
      } catch (error) {
        console.error("Error fetching archived groups:", error);
      }
    };

    fetchArchivedGroups();
  }, []);

  const handleUnarchiveEvent = async (event) => {
    try {
      // First, try to use the context method if available
      if (unarchiveEvent && archivedEvents.some(e => e.id === event.id)) {
        unarchiveEvent(event.id);
      } else {
        // Fall back to the original method
        if (event.id && typeof event.id === 'number') {
          // For backend groups that have numeric IDs
          await toggleArchiveStatus(event.id, false);
          
          // Update the local state by removing from archived lists
          setArchivedUserGroups(prevGroups => 
            prevGroups.filter(group => group.id !== event.id)
          );
        } else {
          // For custom groups with string IDs
          if (customGroups && customGroups.some(group => group.id === event.id)) {
            setCustomGroups(prevGroups => 
              prevGroups.map(group => 
                group.id === event.id ? { ...group, archived: false } : group
              )
            );
          }
        }
      }
      
      setConfirmUnarchive(null);
    } catch (error) {
      console.error("Error unarchiving event:", error);
      alert("Failed to unarchive event. Please try again.");
    }
  };

    const allArchivedEvents = [
      ...archivedEvents,
      ...archivedCustomGroups,
      ...(archivedUserGroups || []).map(group => ({ ...group, type: "event" }))
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
          {!sidebarCollapsed && <p>{firstName} {lastName}</p>}
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
            <div className="account-wrapper">
              <button className="account-btn">My Account</button>
            </div>
          </div>
        </div>

        <h1 className="events-title">Archived Events</h1>

        {archivedEvents.length === 0 ? (
          <p style={{ padding: "2rem" }}>No archived events yet.</p>
        ) : (
          <div className="events-grid-scroll">
            <div className="events-grid">
              {archivedEvents.map((event) => (
                <div key={event.id} className="event-card-link">
                  <div className="event-card">
                    <div className="image-wrapper">
                      <img src={event.img} alt="Event" />
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
                        </span>
                      )}
                      <button
                        className="unarchive-btn"
                        onClick={() => setConfirmUnarchive(event)}
                      >
                        Unarchive
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ✅ Confirmation Popup */}
        {confirmUnarchive && (
          <div className="popup-overlay">
            <div className="popup-box">
              <p>Are you sure you want to unarchive "{confirmUnarchive.name}"?</p>
              <div className="popup-actions">
                <button
                  className="confirm-btn"
                  onClick={() => {
                    unarchiveEvent(confirmUnarchive.id);
                    handleUnarchiveEvent(confirmUnarchive);
                    setConfirmUnarchive(null);
                  }}
                >
                  Yes
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => setConfirmUnarchive(null)}
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


export default ArchivePage; 
