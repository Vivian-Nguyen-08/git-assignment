import React, { useState } from "react";
import {addMemberToGroup,removeMemberFromGroup } from '../api';
import "./ARGroupPopup.css";

const ARGroupPopup = ({ group, onClose, onUpdateMembers }) => {
  const [members, setMembers] = useState(group.members || []);
  const [newEmail, setNewEmail] = useState("");
  const [error, setError] = useState("");

  const handleAddMember = async () => {
    // basic email validation
    if (!newEmail || !newEmail.includes("@") || !newEmail.includes(".")) {
      setError("Please enter a valid email address");
      return;
    }

    // check if email already exists
    if (members.includes(newEmail)) {
      setError("This email is already invited");
      return;
    }

     

    // add new email to members
    const updatedMembers = [...members, newEmail];
    setMembers(updatedMembers);
    setNewEmail("");
    setError("");

    // Add new email to the backend
    try {
      await addMemberToGroup(group.id, newEmail);  
      //onUpdateMembers(updatedMembers); 
    } catch (err) {
      setError("Failed to add member. Try again later.");
    }
  };

  const handleRemoveMember = async (emailToRemove) => {
    // Remove member locally from the list
    const updatedMembers = members.filter((email) => email !== emailToRemove);
    setMembers(updatedMembers);

    // Send the email to be removed to the backend
    try {
      await removeMemberFromGroup(group.id, emailToRemove);  // Call API to remove member
     // onUpdateMembers(updatedMembers);  // update parent with new list of members
    } catch (err) {
      setError("Failed to remove member. Try again later.");
    }
  };

  const handleSave = () => {
    onUpdateMembers(members);
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
            {members.length > 0 ? (
              <div className="members-list">
                {members.map((email, index) => (
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
          <button className="n-btn" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default ARGroupPopup;