import React from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import "./EventPage.css";
import globeLogo from "../assets/globe.png";
import profile_Icon from "../assets/profile_Icon.png";

const EventPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const eventName = location.state?.name || `Event ID: ${id}`;

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
            <span>Dashboard</span>
          </Link>
          <div className="sidebar-link"><span>Chat</span></div>
          <div className="sidebar-link"><span>Docs</span></div>
          <div className="sidebar-link"><span>Calendar</span></div>
          <div className="sidebar-link"><span>Budget</span></div>
          <div className="sidebar-link"><span>Files</span></div>
          <div className="sidebar-link"><span>Edit</span></div>
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
          <textarea disabled placeholder={`This is a description area for ${eventName}`} />
        </div>

        <div className="event-members">
          <h3>Members</h3>
          <div className="member">
            <div className="avatar" />
            <div>
              <p>name</p>
              <p>name@gmail.com</p>
            </div>
          </div>
          <div className="member">
            <div className="avatar" />
            <div>
              <p>name</p>
              <p>name@gmail.com</p>
            </div>
          </div>
          <div className="member">
            <div className="avatar" />
            <div>
              <p>name</p>
              <p>name@gmail.com</p>
            </div>
          </div>
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
