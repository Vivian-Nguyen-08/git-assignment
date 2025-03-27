import React, { useState } from "react";
import "./GroupPopup.css";

const GroupPopup = ({ onClose, onCreate }) => {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [invites, setInvites] = useState("");

  const handleSubmit = () => {
    if (!groupName || !fromDate || !toDate) {
      alert("Please fill out required fields.");
      return;
    }

    const newGroup = {
      name: groupName,
      description,
      fromDate,
      toDate,
      invites: invites.split(",").map(i => i.trim()),
    };

    onCreate(newGroup);
    onClose();
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Create a New Group</h2>

        <label>Group Name:</label>
        <input
          type="text"
          placeholder="Enter group name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />

        <label>Group Description:</label>
        <textarea
          placeholder="Enter description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        <div className="date-row">
          <div>
            <label>To</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <div>
            <label>From</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
        </div>

        <label>Invite your team to join the group:</label>
        <input
          type="text"
          placeholder="Search by name, email or group"
          value={invites}
          onChange={(e) => setInvites(e.target.value)}
        />

        <div className="invited-list">
          {invites &&
            invites
              .split(",")
              .map((email, idx) => (
                <p key={idx}>○ name — {email.trim()}</p>
              ))}
        </div>

        <div className="popup-buttons">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="create-btn" onClick={handleSubmit}>
            Create a Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupPopup;
