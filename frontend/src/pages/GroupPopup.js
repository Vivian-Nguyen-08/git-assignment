import React from "react";
import "./GroupPopup.css";

const GroupPopup = ({ onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Create a New Group</h2>

        <label>Group Name:</label>
        <input type="text" placeholder="Enter group name" />

        <label>Group Description:</label>
        <textarea placeholder="Enter description" rows={4}></textarea>

        <div className="date-row">
          <div>
            <label>To</label>
            <input type="date" />
          </div>
          <div>
            <label>From</label>
            <input type="date" />
          </div>
        </div>

        <label>Invite your team to join the group:</label>
        <input type="text" placeholder="Search by name, email or group" />

        <div className="invited-list">
          <p>○ name — name@gmail.com</p>
          <p>○ name — name@gmail.com</p>
          <p>○ name — name@gmail.com</p>
        </div>

        <div className="popup-buttons">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="create-btn">Create a Group</button>
        </div>
      </div>
    </div>
  );
};

export default GroupPopup;
