import React, { useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import "../styles/EventPage.css";
import globeLogo from "../assets/globe.png";
import profile_Icon from "../assets/profile_Icon.png";
import home_Icon from "../assets/home_Icon.png";
import chat_Icon from "../assets/chat_Icon.png";
import docs_Icon from "../assets/docs_Icon.png";
import calandar_Icon from "../assets/calandar_Icon.png";
import budget_Icon from "../assets/budget_Icon.png";
import file_Icon from "../assets/file_Icon.png";
import edit_Icon from "../assets/edit_Icon.png";
import ARGroupPopup from "./ARGroupPopup";
import api from "../api";

const EventPage = () => {
  const { id } = useParams();
  const location = useLocation();

  // add state for managing the popup visibility
  const [showMemberPopup, setShowMemberPopup] = useState(false);

  // add state to track the current members locally
  const [currentInvites, setCurrentInvites] = useState(
    location.state?.invites || []
  );

  const { name, description, fromDate, toDate } = location.state || {};

  const eventName = name || `Event ID: ${id}`;
  // const firstName = localStorage.getItem("firstName") || "User";
  // const lastName = localStorage.getItem("lastName") || "Name";

  // Create a group object for the popup
  const groupData = {
    id: id,
    name: eventName,
    description: description || "",
    fromDate: fromDate,
    toDate: toDate,
    invites: currentInvites,
  };

  // Handle updating members when saved in the popup
  const handleUpdateMembers = (updatedInvites) => {
    // Update the local state for invites
    setCurrentInvites(updatedInvites);

    // Close the popup
    setShowMemberPopup(false);

    // will need to save to the backend here
    console.log("Members updated:", updatedInvites);
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
    <div className="event-page">
      {/* Sidebar */}
      <div className="event-sidebar">
        <div className="sidebar-user">
          <img src={profile_Icon} alt="User" className="user-icon" />
          <p>
            {firstName} {lastName}
          </p>
        </div>

        <div className="sidebar-links">
          <Link to="/dashboard" className="sidebar-link">
            <img src={home_Icon} alt="home" className="sidebar-img" />
            <span>Dashboard</span>
          </Link>
          <div className="sidebar-link">
            <Link to="/chat" className="sidebar-link">
              <img src={chat_Icon} alt="chat" className="sidebar-img" />
              <span>Chat</span>
            </Link>
          </div>
          <div className="sidebar-link">
            <img src={docs_Icon} alt="docs" className="sidebar-img" />
            <span>Docs</span>
          </div>
          <div className="sidebar-link">
            <img src={calandar_Icon} alt="calendar" className="sidebar-img" />
            <span>Calendar</span>
          </div>
          <div className="sidebar-link">
            <img src={budget_Icon} alt="budget" className="sidebar-img" />
            <span>Budget</span>
          </div>
          <div className="sidebar-link">
            <Link to="/files" className="sidebar-link">
              <img src={file_Icon} alt="files" className="sidebar-img" />
              <span>Files</span>
            </Link>
          </div>
          <div className="sidebar-link">
            <img src={edit_Icon} alt="edit" className="sidebar-img" />
            <span>Edit</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="event-content">
        <div className="event-top-nav">
          <img src={globeLogo} alt="Planora Logo" className="nav-logo" />
          <div className="nav-links">
            <a href="/about">About Us</a>
            <a href="/resources">Resources</a>
            <button className="account-btn">My Account ⌄</button>
          </div>
        </div>

        <h1 className="event-title">{eventName}</h1>

        <div className="event-description">
          <label>Group Description:</label>
          <textarea
            disabled
            value={description || `This is a description area for ${eventName}`}
          />
        </div>

        <div className="event-dates">
          <p>
            <strong>From:</strong> {fromDate || "N/A"}
          </p>
          <p>
            <strong>To:</strong> {toDate || "N/A"}
          </p>
        </div>

        <div className="event-members">
          <div className="members-header">
            <h3>Members</h3>
            <button
              className="manage-members-btn"
              onClick={() => setShowMemberPopup(true)}
            >
              Manage Members
            </button>
          </div>

          {currentInvites && currentInvites.length > 0 ? (
            <div className="members-list">
              {currentInvites.map((email, index) => (
                <div className="member" key={index}>
                  <div className="avatar">{email.charAt(0).toUpperCase()}</div>
                  <div className="member-info">
                    <p className="member-name">{email.split("@")[0]}</p>
                    <p className="member-email">{email}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-members">
              No members invited. Click "Manage Members" to add people.
            </p>
          )}
        </div>

        <footer className="event-footer">
          <div>Planora</div>
          <div>Support</div>
        </footer>
      </div>

      {showMemberPopup && (
        <ARGroupPopup
          group={groupData}
          onClose={() => setShowMemberPopup(false)}
          onUpdateMembers={handleUpdateMembers}
        />
      )}
    </div>
  );
};

export default EventPage;
