import React, { useState } from "react";
import "./GroupPopup.css";

const stockImages = [
  "https://images.unsplash.com/photo-1552083375-1447ce886485?fm=jpg&q=60&w=600",
  "https://images.unsplash.com/photo-1698138819865-88d3add4838f?fm=jpg&q=60&w=600",
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?fm=jpg&q=60&w=600",
  "https://images.unsplash.com/photo-1496387246400-88aa6b10f8cc?fm=jpg&q=60&w=600",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?fm=jpg&q=60&w=600"
];

const GroupPopup = ({ onClose, onCreate }) => {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [invites, setInvites] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [uploadedImage, setUploadedImage] = useState("");
  const [showStockOptions, setShowStockOptions] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imgUrl = URL.createObjectURL(file);
      setUploadedImage(imgUrl);
      setSelectedImage("");
    }
  };

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
      invites: invites.split(",").map((i) => i.trim()),
      img: uploadedImage || selectedImage || "",
    };

    onCreate(newGroup);
    onClose();
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Create a New Group</h2>

        <label>Group Name:</label>
        <input type="text" value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="Enter group name" />

        <label>Group Description:</label>
        <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter description" />

        <div className="date-row">
          <div>
            <label>To</label>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>
          <div>
            <label>From</label>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </div>
        </div>

        <label>Invite your team:</label>
        <input type="text" value={invites} onChange={(e) => setInvites(e.target.value)} placeholder="Emails (comma-separated)" />
        <div className="invited-list">
          {invites &&
            invites
              .split(",")
              .map((email, idx) => <p key={idx}>○ name — {email.trim()}</p>)}
        </div>

        <label>Upload Image:</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />

        <button className="toggle-stock-btn" onClick={() => setShowStockOptions(!showStockOptions)}>
          {showStockOptions ? "Hide Stock Images" : "Choose From Stock Images"}
        </button>

        {showStockOptions && (
          <div className="stock-image-scroll">
            {stockImages.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Stock ${idx}`}
                className={`stock-thumbnail ${selectedImage === url ? "selected" : ""}`}
                onClick={() => {
                  setSelectedImage(url);
                  setUploadedImage("");
                }}
              />
            ))}
          </div>
        )}

        {(uploadedImage || selectedImage) && (
          <div className="image-preview">
            <p>Preview:</p>
            <img src={uploadedImage || selectedImage} alt="Selected preview" />
          </div>
        )}

        <div className="popup-buttons">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="create-btn" onClick={handleSubmit}>Create a Group</button>
        </div>
      </div>
    </div>
  );
};

export default GroupPopup;
