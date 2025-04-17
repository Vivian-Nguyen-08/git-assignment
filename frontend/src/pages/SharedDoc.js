// SharedDocs.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/SharedDoc.css";
import "../styles/EventNavbar.css";

// Assets
import profile_Icon from "../assets/profile_Icon.png";
import calandar_Icon from "../assets/calandar_Icon.png";
import docs_Icon from "../assets/docs_Icon.png";
import chat_Icon from "../assets/chat_Icon.png";
import edit_Icon from "../assets/edit_Icon.png";
import budget_Icon from "../assets/budget_Icon.png";
import logo from "../assets/globe.png";
import file_Icon from "../assets/file_Icon.png";
import home_Icon from "../assets/home_Icon.png";

const SharedDocs = () => {
  return (
    <div className="page">
      <div className="sidebar">
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
          <Link to="/docs" className="sidebar-link">
            <img src={docs_Icon} alt="docs" className="sidebar-img" />
            <span>Docs</span>
          </Link>
          <div className="sidebar-link">
            <img src={calandar_Icon} alt="calendar" className="sidebar-img" />
            <span>Calendar</span>
          </div>
          <Link to="/budget" className="sidebar-link">
            <img src={budget_Icon} alt="budget" className="sidebar-img" />
            <span>Budget</span>
          </Link>
          <Link to="/files" className="sidebar-link">
            <img src={file_Icon} alt="files" className="sidebar-img" />
            <span>Files</span>
          </Link>
          <div className="sidebar-link">
            <img src={edit_Icon} alt="edit" className="sidebar-img" />
            <span>Edit</span>
          </div>
        </div>
      </div>

      <div className="shared-docs-dashboard">
        <div className="shared-docs-content">
          <div className="top-nav">
            <img src={logo} alt="Planora Logo" className="logo" />
            <div className="nav-right">
              <Link to="/about">About Us</Link>
              <Link to="/resources">Resources</Link>
              <button className="account-btn">My Account ⌄</button>
            </div>
          </div>

          <h1 className="title">Shared Documents</h1>

          <div className="docs-grid">
            <div className="doc-box">
              <h2>Document 1</h2>
              <div className="embedded-doc">
                <p>[Embed Google Doc or Office Doc here]</p>
              </div>
            </div>

            <div className="doc-box">
              <h2>Document 2</h2>
              <div className="embedded-doc">
                <p>[Embed Google Doc or Office Doc here]</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedDocs;
