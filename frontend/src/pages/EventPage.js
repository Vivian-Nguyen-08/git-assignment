import React from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import "./EventPage.css";
import globeLogo from "../assets/globe.png";
import profile_Icon from "../assets/profile_Icon.png";
import home_Icon from "../assets/home_Icon.png";
import chat_Icon from "../assets/chat_Icon.png";
import docs_Icon from "../assets/docs_Icon.png";
import calandar_Icon from "../assets/calandar_Icon.png";
import budget_Icon from "../assets/budget_Icon.png";
import file_Icon from "../assets/file_Icon.png";
import edit_Icon from "../assets/edit_Icon.png";

const EventPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const {
    name,
    description,
    fromDate,
    toDate,
    invites
  } = location.state || {};

  const eventName = name || `Event ID: ${id}`;

  return (
    <div className="event-page">
      {/* Sidebar */}
      <div className="event-sidebar">
        <div className="sidebar-user">
          <img src={profile_Icon} alt="User" className="user-icon" />
          <p>User Name</p>
        </div>

        <div className="sidebar-links">
          <Link to="/dashboard" className="sidebar-link">
            <img src={home_Icon} alt="home" className="sidebar-img" />
            <span>Dashboard</span>
          </Link>
          <Link to="/chat" className="sidebar-link">
            <img src={chat_Icon} alt="chat" className="sidebar-img" />
            <span>Chat</span>
          </Link>
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
            <img src={file_Icon} alt="files" className="sidebar-img" />
            <span>Files</span>
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
          <p><strong>From:</strong> {fromDate || "N/A"}</p>
          <p><strong>To:</strong> {toDate || "N/A"}</p>
        </div>

        <div className="event-members">
          <h3>Members</h3>
          {invites && invites.length > 0 ? (
            invites.map((email, index) => (
              <div className="member" key={index}>
                <div className="avatar" />
                <div>
                  <p>name</p>
                  <p>{email}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No members invited.</p>
          )}
        </div>

        <footer className="event-footer">
          <div>Planora</div>
          <div>Support</div>
        </footer>
      </div>
    </div>
  );
};

export default EventPage;
