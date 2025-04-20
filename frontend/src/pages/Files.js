import React, { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import "../styles/Files.css";
import globeLogo from "../assets/globe.png";
import profile_Icon from "../assets/profile_Icon.png";
import home_Icon from "../assets/home_Icon.png";
import chat_Icon from "../assets/chat_Icon.png";
import docs_Icon from "../assets/docs_Icon.png";
import calandar_Icon from "../assets/calandar_Icon.png";
import budget_Icon from "../assets/budget_Icon.png";
import file_Icon from "../assets/file_Icon.png";
import edit_Icon from "../assets/edit_Icon.png";
import api from "../api";

const Files = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [fileItems, setFileItems] = useState([]);
  const [folderContents, setFolderContents] = useState({});
  const [currentFolder, setCurrentFolder] = useState(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Fetch user information (username, etc.)
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

  // Fetch files from the server
  const fetchFiles = async () => {
    const groupId = localStorage.getItem("currentEventId");
    

    if (!groupId) {
      console.error("Group ID not found");
      return;
    }
    try {
      const response = await api.get(`/upload/group/${groupId}`);
      const filesFromDB = response.data.map((file) => ({
        type: "file",
        name: file,
        url: `${process.env.REACT_APP_API_BASE_URL}/upload/${file}`,
      }));

      setFileItems(filesFromDB);
    } catch (err) {
      console.error("Failed to fetch files:", err);
    }
  };

  useEffect(() => {
    fetchUserInfo();
    fetchFiles(); // Fetch files when component loads
  }, []);

  // Handle folder creation
  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const newFolder = { type: "folder", name: newFolderName };

      if (currentFolder === null) {
        setFileItems((prev) => [...prev, newFolder]);
      } else {
        setFolderContents((prev) => ({
          ...prev,
          [currentFolder]: [...(prev[currentFolder] || []), newFolder],
        }));
      }

      setFolderContents((prev) => ({
        ...prev,
        [newFolderName]: [],
      }));

      setNewFolderName("");
      setShowInput(false);
    }
  };

  // Handle folder click for navigation
  const handleFolderClick = (folderName) => {
    setCurrentFolder(folderName);
  };

  // Handle going back from a folder
  const handleBackClick = () => {
    setCurrentFolder(null);
  };

  // use `currentEventId` to associate uploaded files with the correct group
  const currentEventId = localStorage.getItem("currentEventId");

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const fileURL = URL.createObjectURL(file); 

    const formData = new FormData();
    formData.append("file", file);
    formData.append("group_id", currentEventId);

    try {
      const response = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uploadedFile = {
        type: "file",
        name: file.name,
        url: fileURL,
      };

      if (currentFolder === null) {
        setFileItems((prev) => [...prev, uploadedFile]);
      } else {
        setFolderContents((prev) => ({
          ...prev,
          [currentFolder]: [...(prev[currentFolder] || []), uploadedFile],
        }));
      }
    } catch (error) {
      console.error("Upload failed:", error.response?.data || error);
    }
  };

  // Determine what files or folders to display based on current folder state
  const displayItems =
    currentFolder === null ? fileItems : folderContents[currentFolder] || [];

  return (
    <div className="files-page">
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
            <img src={chat_Icon} alt="chat" className="sidebar-img" />
            <span>Chat</span>
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
          <Link to="/Files" className="sidebar-link">
            <img src={file_Icon} alt="files" className="sidebar-img" />
            <span>Files</span>
          </Link>
          <div className="sidebar-link">
            <img src={edit_Icon} alt="edit" className="sidebar-img" />
            <span>Edit</span>
          </div>
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
              <button className="account-btn">
                <span>My Account</span> ⌄
              </button>
              {dropdownOpen && (
                <div className="account-dropdown">
                  <Link to="/profile">Profile</Link>
                  <Link to="/Settings">Settings</Link>
                  <Link to="/login">Logout</Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <h1 className="files-title">Files</h1>

        <div className="files-container">
          <div className="file-buttons">
            {!currentFolder && (
              <button
                className="create-folder"
                onClick={() => setShowInput(true)}
              >
                Create Folder
              </button>
            )}
            <label className="upload">
              <i className="upload-icon">⬆</i> Upload
              <input
                type="file"
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
            </label>
          </div>

          {showInput && (
            <div className="folder-input">
              <input
                type="text"
                placeholder="Enter folder name."
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
              />
              <button onClick={handleCreateFolder}>Create</button>
            </div>
          )}

          {currentFolder && (
            <button onClick={handleBackClick} className="back-btn">
              ← Back
            </button>
          )}

          <div className="file-grid">
            {displayItems.map((item, index) => (
              <div
                key={index}
                className="file-item"
                onClick={() =>
                  item.type === "folder" && handleFolderClick(item.name)
                }
              >
                <div className="file-icon">
                  {item.type === "folder" ? "📁" : "📄"}
                </div>
                {item.type === "file" && item.url ? (
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.name}
                  </a>
                ) : (
                  <span>{item.name}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Files;
