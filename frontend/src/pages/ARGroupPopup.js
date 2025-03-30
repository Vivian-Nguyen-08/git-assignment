import React, { useState } from "react";
import "./ARGroupPopup.css";

const ARGroupPopup = ({ group, onClose, onUpdateMembers }) => {
  const [invites, setInvites] = useState(group.invites || []);
  const [newEmail, setNewEmail] = useState("");
  const [error, setError] = useState("");

  const handleAddMember = () => {
    // Basic email validation
    if (!newEmail || !newEmail.includes("@") || !newEmail.includes(".")) {
      setError("Please enter a valid email address");
      return;
    }

    // Check if email already exists
    if (invites.includes(newEmail)) {
      setError("This email is already invited");
      return;
    }

    // Add new email to invites
    const updatedInvites = [...invites, newEmail];
    setInvites(updatedInvites);
    setNewEmail("");
    setError("");
  };

  const handleRemoveMember = (emailToRemove) => {
    const updatedInvites = invites.filter(email => email !== emailToRemove);
    setInvites(updatedInvites);
  };

  const handleSave = () => {
    onUpdateMembers(invites);
  };

  return (
    <div className="ar-popup-overlay">
      <div className="ar-popup-container">
        <div className="ar-popup-header">
          <h2>Manage Group Members</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="ar-popup-content">
          <div className="group-info">
            <h3>{group.name}</h3>
            <p>{group.description}</p>
          </div>

          <div className="invite-section">
            <h4>Invite Members</h4>
            <div className="invite-input-group">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter email address"
                className="email-input"
              />
              <button 
                className="add-btn"
                onClick={handleAddMember}
              >
                Add
              </button>
            </div>
            {error && <p className="error-message">{error}</p>}
          </div>

          <div className="current-members">
            <h4>Current Members</h4>
            {invites.length > 0 ? (
              <div className="members-list">
                {invites.map((email, index) => (
                  <div className="member-item" key={index}>
                    <span className="member-email">{email}</span>
                    <button 
                      className="remove-btn"
                      onClick={() => handleRemoveMember(email)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-members">No members yet. Add members using the form above.</p>
            )}
          </div>
        </div>

        <div className="ar-popup-footer">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="save-btn" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default ARGroupPopup;