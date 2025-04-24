// Author: Sarah Park
import React, { useState, useRef, useEffect } from "react";
//import "./EventPage.css"; // Sidebar + Top nav
import "../styles/ChatPage.css";  // Updated Chat styles
import profile_Icon from "../assets/profile_Icon.png";
import globeLogo from "../assets/globe.png";
import home_Icon from "../assets/home_Icon.png";
import chat_Icon from "../assets/chat_Icon.png";
import docs_Icon from "../assets/docs_Icon.png";
import calandar_Icon from "../assets/calandar_Icon.png";
import budget_Icon from "../assets/budget_Icon.png";
import file_Icon from "../assets/file_Icon.png";
import edit_Icon from "../assets/edit_Icon.png";

import sendIcon from "../assets/Send Message Icon.png";
import attachIcon from "../assets/File Upload Icon.png";
import menuIcon from "../assets/3 Dots Icon.png";
import videoIcon from "../assets/Video Chat Icon.png";
import avatarSarah from "../assets/image 70.png";
import avatarKiki from "../assets/image 70.png";
import EmojiPicker from "emoji-picker-react"
import avatarGroup from "../assets/image 70.png";
import { useParams } from "react-router-dom";
import api from "../api";            


import { Link } from "react-router-dom";

const ChatPage = () => {
  const fileInputRef = useRef(null); 
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const fileURL = URL.createObjectURL(file);
  
    setSelectedFile({
      name: file.name,
      url: fileURL,
      type: file.type
    });
  
    
  };
  
  const handleVideoClick = async () => {
    try {
      const res = await fetch("http://localhost:8000/create-zoom-meeting", {
        method: "POST",
      });
      const data = await res.json();
      if (data.join_url) {
        window.open(data.join_url, "_blank");
      } else {
        alert("Zoom meeting failed. Check backend console.");
      }
    } catch (err) {
      console.error(err);
      alert("Could not reach backend.");
    }
  };
  
  

const { id } = useParams();                
const [eventInfo, setEventInfo] = useState(null);
const [members,   setMembers]   = useState([]);


const [messages, setMessages] = useState([
  { sender: "Sarah", text: "Hello everyone!",                type: "left" },
  { sender: "Kiki",  text: "When is everyone free to meet?", type: "left" }
]);


useEffect(() => {
  if (!id) return;                                 

  (async () => {
    try {
      const { data } = await api.get(`/group/${id}`);   
      setEventInfo({ name: data.name, image: data.img });
      setMembers(data.members || []);                   
    } catch (err) {
      console.error("GET /group/{id} failed:", err);
    }
  })();
}, [id]);


useEffect(() => {
  if (members.length === 0) return;              
  setMessages(prev =>
    prev.map((msg, i) =>
      i < members.length
        ? { ...msg, sender: members[i].split("@")[0] } 
        : msg
    )
  );
}, [members]);



  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); 
  const messagesEndRef = useRef(null);
  const handleSend = () => {
    if ((!newMessage.trim() && !selectedFile)) {
      if (!selectedFile && newMessage.trim() === "") {
        setError("Please enter a message");
      }
      return;
    }
    // Prevent sending if over limit
    if (newMessage.length > 160) {
      setError("Exceeds 160 characters");
      return;
    }
  
    // Prevent sending empty
    if (!newMessage.trim() && !selectedFile) return;
  
    if (selectedFile) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "You",
          text: selectedFile.name,
          fileLink: selectedFile.url,
          type: "right",
        },
      ]);
      setSelectedFile(null);
    }
  
    if (newMessage.trim()) {
      setMessages((prev) => [
        ...prev,
        { sender: "You", text: newMessage, type: "right" }
      ]);
    }
  
    setNewMessage("");
    setError(""); // clear error after sending
    setShowEmojiPicker(false);
  };
  
  

  const [error, setError] = useState("");


  const onEmojiClick = (emojiData) => {
    setNewMessage((prev) => prev + emojiData.emoji);
  };


 
  useEffect(() => {
    const loadEvent = async () => {
      try {
        const { data } = await api.get(`/group/${id}`);   
        setEventInfo({ name: data.name, image: data.img }); 
        setMembers(data.members || []);  
      } catch (err) {
        console.error("Could not load event", err);
      }
    };
    loadEvent();
  }, [id]);
  


  //useEffect(() => {
   // messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  //}, [messages]);

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
          <Link to="/chat" className="sidebar-link" style={{ backgroundColor: "#cbe4f6", borderRadius: "10px" }}>
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

      {/* Main Chat Content */}
      <div className="event-content">
        <div className="event-top-nav">
          <img src={globeLogo} alt="Planora Logo" className="nav-logo" />
          <div className="nav-links">
            <a href="/about">About Us</a>
            <a href="/resources">Resources</a>
            <button className="account-btn">My Account ⌄</button>
          </div>
        </div>

        <div className="chat-container">
          {/* Chat Header */}
          <div className="chat-header-section">
            <div className="chat-header-left">
            <img
              src={eventInfo?.image || avatarGroup}
              alt="Avatar"
              className="avatar-circle"
            />
            <h2 className="chat-title">
              {eventInfo?.name || " "}
            </h2>

            </div>
            <div className="chat-header-right">
            <img
              src={videoIcon}
              alt="Video Chat"
              className="header-icon"
              onClick={handleVideoClick}
            />

              <img src={menuIcon} alt="Menu" className="header-icon" />
            </div>
          </div>

          {/* Chat Messages */}
        <div className="chat-messages">
        <div className="chat-inner">
            {messages.map((msg, i) => (
            <div key={i} className={`message-row ${msg.type}`}>
                {msg.type === "left" && (
                <img src={msg.sender === "Kiki" ? avatarKiki : avatarSarah} alt="avatar" className="chat-avatar" />
                )}
                <div className="message-bubble-container">
                {/* {msg.date && <div className="chat-date">{msg.date}</div>} */}
                {msg.sender !== "You" && <p className="chat-name">{msg.sender}</p>}
                <div className="chat-bubble">
                <div className="chat-text">
  {msg.fileLink ? (
    msg.text.match(/\.(jpeg|jpg|png|gif|png)$/i) ? (
      <div className="image-bubble">
  <img
    src={msg.fileLink}
    alt={msg.text}
    className="chat-image-preview"
  />
  <a
    href={msg.fileLink}
    download={msg.text}
    target="_blank"
    rel="noopener noreferrer"
    className="image-download-link"
  >
    ⬇ Download {msg.text}
  </a>
</div>

    ) : (
      <div className="file-bubble">
  <div className="file-icon">📄</div>
  <div className="file-info">
    <span className="file-name">{msg.text}</span>
    <a
      href={msg.fileLink}
      download={msg.text}
      target="_blank"
      rel="noopener noreferrer"
      className="file-download"
    >
      ⬇ Download
    </a>
  </div>
</div>

    )
  ) : (
    msg.text
  )}
</div>


                </div>
                {/* {msg.time && <div className="chat-time">{msg.time}</div>} */}
                </div>
            </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
        </div>





        <div className="chat-input-area">
  <input
    type="file"
    ref={fileInputRef}
    style={{ display: "none" }}
    onChange={handleFileUpload}
  />

  <img
    src={attachIcon}
    alt="Attach"
    className="input-icon"
    onClick={() => fileInputRef.current.click()}
  />

  {/* 🆕 Preview + Input together */}
  <div className="input-with-preview">
      {selectedFile && (
      <div className="attachment-chip">
        {selectedFile.type.startsWith("image/") ? (
          <>
            <img src={selectedFile.url} alt={selectedFile.name} className="inline-thumb" />
            <span className="file-label">{selectedFile.name}</span>
          </>
        ) : (
          <>
            <span className="file-icon">📄</span>
            <span className="file-label">{selectedFile.name}</span>
          </>
        )}

       
        <button className="remove-file-btn" onClick={() => setSelectedFile(null)}>
          ×
        </button>
      </div>
    )}


<input
  type="text"
  placeholder="Type your message here..."
  value={newMessage}
  onChange={(e) => {
    const input = e.target.value;
    setNewMessage(input);

    if (input.length <= 160 && error) {
      setError(""); 
    }
  }}
  onKeyDown={(e) => e.key === "Enter" && handleSend()}
/>

<p className="char-count">
  {newMessage.length} / 160 
</p>
{error && <p className="error-message">{error}</p>}

  </div>

  <button className="emoji-toggle-btn" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
    ☻
  </button>

  <button className="send-btn" onClick={handleSend}>
    <img src={sendIcon} alt="Send" className="send-icon" />
  </button>
</div>


         
          {showEmojiPicker && (
            <div className="emoji-picker-container">
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}
        </div>

        {/* <footer className="event-footer">
          <div>Planora</div>
          <div>Support</div>
        </footer> */}
      </div>
    </div>
  );
};

export default ChatPage;
