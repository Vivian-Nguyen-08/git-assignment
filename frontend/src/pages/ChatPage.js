// Author: Sarah Park
import React, { useState, useRef, useEffect } from "react";
//import "./EventPage.css"; // Sidebar + Top nav
import "./ChatPage.css";  // Updated Chat styles
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

import { Link } from "react-router-dom";

const ChatPage = () => {
  const [messages, setMessages] = useState([
    { sender: "Sarah", text: "Hello everyone!", type: "left", time: "8:36 PM", date: "MAR 13" },
    { sender: "You", text: "Hi! How are you?", type: "right" },
    { sender: "Kiki", text: "When is everyone free to meet?", type: "left", date: "MAR 14" },
    { sender: "You", text: "I'm free tomorrow", type: "right" },
    { sender: "Sarah", text: "Can we do Saturday???", type: "left" },
    { sender: "You", text: "That works for me.", type: "right" }
  ]);

  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const handleSend = () => {
    if (newMessage.trim()) {
      setMessages((prev) => [
        ...prev,
        { sender: "You", text: newMessage, type: "right" }
      ]);
      setNewMessage("");
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
              <div className="avatar-circle" />
              <h2 className="chat-title">Event XYZ</h2>
            </div>
            <div className="chat-header-right">
              <img src={videoIcon} alt="Video Chat" className="header-icon" />
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
                    <div className="chat-text">{msg.text}</div>
                </div>
                {/* {msg.time && <div className="chat-time">{msg.time}</div>} */}
                </div>
            </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
        </div>


          {/* Chat Input */}
          <div className="chat-input-area">
            <img src={attachIcon} alt="Attach" className="input-icon" />
            <input
              type="text"
              placeholder="Type your message here..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button className="send-btn" onClick={handleSend}>
              <img src={sendIcon} alt="Send" className="send-icon" />
            </button>
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

export default ChatPage;
