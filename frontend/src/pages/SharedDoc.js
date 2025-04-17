import React, { useState } from "react";
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
  const [links, setLinks] = useState([{ id: Date.now(), value: "" }]);
  const [embedItems, setEmbedItems] = useState([]);
  const [modal, setModal] = useState({ open: false, url: "", index: null });
  const [tempName, setTempName] = useState("");

  const handleInputChange = (id, value) => {
    setLinks((prev) => prev.map((link) => (link.id === id ? { ...link, value } : link)));
  };

  const addInput = () => {
    setLinks((prev) => [...prev, { id: Date.now(), value: "" }]);
  };

  const convertToEmbedUrl = (url) => {
    if (url.includes("/folders/")) {
      const match = url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
      return match ? `https://drive.google.com/embeddedfolderview?id=${match[1]}#grid` : "";
    }
    if (url.includes("/document/d/")) {
      const match = url.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
      return match ? `https://docs.google.com/document/d/${match[1]}/preview` : "";
    }
    if (url.includes("/spreadsheets/d/")) {
      const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
      return match ? `https://docs.google.com/spreadsheets/d/${match[1]}/preview` : "";
    }
    if (url.includes("/presentation/d/")) {
      const match = url.match(/\/presentation\/d\/([a-zA-Z0-9_-]+)/);
      return match ? `https://docs.google.com/presentation/d/${match[1]}/preview` : "";
    }
    return "";
  };

  const getEditUrl = (embedUrl) => {
    const docMatch = embedUrl.match(/document\/d\/([a-zA-Z0-9_-]+)/);
    if (docMatch) return `https://docs.google.com/document/d/${docMatch[1]}/edit`;
    const sheetMatch = embedUrl.match(/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
    if (sheetMatch) return `https://docs.google.com/spreadsheets/d/${sheetMatch[1]}/edit`;
    const slideMatch = embedUrl.match(/presentation\/d\/([a-zA-Z0-9_-]+)/);
    if (slideMatch) return `https://docs.google.com/presentation/d/${slideMatch[1]}/edit`;
    const folderMatch = embedUrl.match(/embeddedfolderview\?id=([a-zA-Z0-9_-]+)/);
    if (folderMatch) return `https://drive.google.com/drive/folders/${folderMatch[1]}`;
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    links.forEach((link, index) => {
      const embedUrl = convertToEmbedUrl(link.value);
      if (embedUrl) {
        setModal({ open: true, url: embedUrl, index });
      }
    });
  };

  const handleConfirmName = () => {
    setEmbedItems((prev) => [...prev, { name: tempName || "Untitled", url: modal.url }]);
    setModal({ open: false, url: "", index: null });
    setTempName("");
  };

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

          <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
            {links.map((link, index) => (
              <div
                key={link.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "12px",
                }}
              >
                <input
                  type="text"
                  placeholder={`Paste Google Drive link ${index + 1}`}
                  value={link.value}
                  onChange={(e) => handleInputChange(link.id, e.target.value)}
                  style={{
                    width: "60%",
                    padding: "10px",
                    fontSize: "14px",
                    height: "40px",
                    borderRadius: "8px",
                  }}
                />
                {index === 0 && (
                  <>
                    <button
                      type="button"
                      className="action-btn"
                      onClick={addInput}
                      style={{
                        height: "40px",
                        padding: "0 14px",
                        fontSize: "14px",
                        borderRadius: "8px",
                      }}
                    >
                      ＋
                    </button>
                    <button
                      type="submit"
                      className="action-btn"
                      style={{
                        height: "40px",
                        padding: "0 14px",
                        fontSize: "14px",
                        borderRadius: "8px",
                      }}
                    >
                      ▶️
                    </button>
                  </>
                )}
              </div>
            ))}
          </form>

          {modal.open && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>Enter a name for this document</h3>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Document name"
                  style={{ padding: "8px", width: "80%" }}
                />
                <div style={{ marginTop: "15px" }}>
                  <button className="action-btn" onClick={handleConfirmName}>
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}

          {embedItems.map((item, idx) => {
            const editUrl = getEditUrl(item.url);
            return (
              <div key={idx} className="doc-box" style={{ marginBottom: "30px" }}>
                <h2 style={{ marginBottom: "10px" }}>{item.name}</h2>
                <iframe
                  src={item.url}
                  width="100%"
                  height="600px"
                  frameBorder="0"
                  title={`Embedded Content ${idx + 1}`}
                  style={{ border: "1px solid #ccc" }}
                />
                {editUrl && (
                  <div style={{ marginTop: "10px" }}>
                    <a
                      href={editUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="action-btn"
                    >
                      📝 Open in Google Drive
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SharedDocs;
