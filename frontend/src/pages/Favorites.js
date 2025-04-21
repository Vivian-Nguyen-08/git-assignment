import React, { useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { useFavorites} from "../context/FavoritesContext";
import api from "../api";
import { getFavoriteGroups, toggleFavoriteStatus } from '../api'; 



// Icons
import profile_Icon from "../assets/profile_Icon.png";
import home_Icon from "../assets/home_Icon.png"; // ✅ correct home icon
import settings_Icon from "../assets/settings_Icon.png";
import bookmark_Icon from "../assets/bookmark_Icon.png";
import calandar_Icon from "../assets/calandar_Icon.png";
import archive_Icon from "../assets/archive_Icon.png";
import filledSave_Icon from "../assets/filledSave_Icon.png";
import globeLogo from "../assets/globe.png"; // ✅ Planora logo
import emptySave_Icon from "../assets/emptySave_Icon.png";

const Favorites = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);


   

  const [confirmUnfavorite, setConfirmUnfavorite] = useState(null);
  const {favoriteEvents, unfavoriteEvent} = useFavorites();
  // const firstName = localStorage.getItem("firstName") || "User";
  // const lastName = localStorage.getItem("lastName") || "Name";

  const [customGroups, setCustomGroups] = useState([]);
  const [favoriteUserGroups, setFavoriteUserGroups] = useState([]);
  const favoriteCustomGroups = customGroups?.filter(
    (group) => group.favorite) || [];


    

  useEffect(() => {
    const fetchFavoriteGroups = async () => {
      try {
        const response = await getFavoriteGroups();
        console.log("Favorite groups response:", response);
        setFavoriteUserGroups(response.favorite_groups || []);
      } catch (error) {
        console.error("Error fetching favorite groups:", error);
      }
    };


    fetchFavoriteGroups();
  }, []);


  const handleUnfavoriteEvent = async (event) => {
    try {
      // First, try to use the context method if available
      if (unfavoriteEvent && favoriteEvents.some(e => e.id === event.id)) {
        unfavoriteEvent(event.id);
      } else {
        // Fall back to the original method
        if (event.id && typeof event.id === 'number') {
          // For backend groups that have numeric IDs
          await toggleFavoriteStatus(event.id, false);
         
          // Update the local state by removing from archived lists
          setFavoriteUserGroups(prevGroups =>
            prevGroups.filter(group => group.id !== event.id)
          );
        } else {
          // For custom groups with string IDs
          if (customGroups && customGroups.some(group => group.id === event.id)) {
            setCustomGroups(prevGroups =>
              prevGroups.map(group =>
                group.id === event.id ? { ...group, favorite: false } : group
              )
            );
          }
        }
      }
     
      setConfirmUnfavorite(null);
    } catch (error) {
      console.error("Error unfavoring event:", error);
      alert("Failed to unfavorite event. Please try again.");
    }
  };


    const allFavoriteEvents = [
      ...favoriteCustomGroups,
      ...(favoriteUserGroups || []).map(group => ({ ...group, type: "event" }))
    ];

 
 
  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
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
            <img src={home_Icon} alt="dashboard" className="sidebar-icon" />
            {!sidebarCollapsed && <span>Dashboard</span>}
          </Link>

          <Link to="/settings" className="sidebar-link">
            <img src={settings_Icon} alt="settings" className="sidebar-icon" />
            {!sidebarCollapsed && <span>Settings</span>}
          </Link>

          <Link
            to="/favorites"
            className="sidebar-link-fav"
            style={{ backgroundColor: "#cbe4f6", borderRadius: "10px" }}
          >
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
            {allFavoriteEvents.length === 0 ? (
              <p style={{ color: "white" }}>No favorites yet!</p>
            ) : (
              allFavoriteEvents.map((event) => (
                      <Link
                    to={`/event/${event.id}`}
                    key={event.id}
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
                      <img src={event.img} alt="Event" />
                          <button
                        className="bookmark-btn"
                        onClick={(e) => {
                          e.preventDefault();
                
                      
                        

                        }}
                      >
                        <img
                          src={filledSave_Icon}
                          alt="Saved"
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
