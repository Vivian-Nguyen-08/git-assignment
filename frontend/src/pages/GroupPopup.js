import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
//import { useWebSocket } from "../context/WebSocketContext";
import "../styles/GroupPopup.css";

const stockImages = [
  "https://images.unsplash.com/photo-1552083375-1447ce886485?fm=jpg&q=60&w=600",
  "https://images.unsplash.com/photo-1698138819865-88d3add4838f?fm=jpg&q=60&w=600",
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?fm=jpg&q=60&w=600",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBjUYQJKzRWz-K_4dH1hokEXxgbf76i5lvSA&s",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?fm=jpg&q=60&w=600",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTL0f1FTJ_wVMchZUAY-Tmh9kh22W-Y9Catw&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQu1vkshhQCFLVv181Kbq4I_q3QUJ3PbVdBwA&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-QT5Lj6ypLSPdDOIRN8ZA-_Rztzg0cweNhQ&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqcP1A-Ik3VaaiDS8eEGGQ4OSh3ZQ-Rslq4g&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkuMgz80AIfWmQAA385y4uXKMCPCqqb2wyOg&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDA1jeWk6J6RgmOv7oGgpV9E6ItV8u7HPvGg&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWtSiTBCDcpYWhZ-IqbrXVzexgJcdZpOQu5w&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOVFWZcMUJJVdZyBwwGdhZFjI5__-pnv5YcQ&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGWxyemAl4_DksuHgUmSbSQyhkRQXQPSjGjw&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_Ca3-VaCP66P-Kvf750eZqcvsj0V6LTyDtw&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREuz0S18PL9PfuovsHeay6hfmGhERuj_zVIg&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSucBQjKmohH8I7bkSx504YYLpOSpRGE3EjIw&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ6fXd2iJaG3oGO-4BVTCx798XL4B2JF_XpQ&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTR3avQsMpCc3qSkzmt-Tb-S_euhPtbHbn6UA&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3gICF_QLCRyGRG27xCFzRWbd_aM52CHdnUQ&s",
];

const getErrorMessage = (data) => {
  if (typeof data === "string") return data;
  if (data?.detail) return data.detail;
  if (data?.message) return data.message;
  const firstKey = Object.keys(data || {})[0];
  return Array.isArray(data[firstKey]) ? data[firstKey][0] : "Unknown error";
};

const GroupPopup = ({ onClose, onCreate }) => {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [members, setMembers] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [uploadedImage, setUploadedImage] = useState("");
  const [showStockOptions, setShowStockOptions] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userGroups, setUserGroups] = useState([]);
  const [showGroupPopup, setShowGroupPopup] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imgUrl = URL.createObjectURL(file);
      setUploadedImage(imgUrl);
      setSelectedImage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let missingFields = [];

  if (!groupName) missingFields.push("Group Name");
  if (!fromDate) missingFields.push("From Date");
  if (!toDate) missingFields.push("To Date");

  if (missingFields.length > 0) {
    setError(`Please fill out: ${missingFields.join(", ")}`);
    return;
  }

    let from = new Date(fromDate);
    let to = new Date(toDate);

    if (from > to) {
      [from, to] = [to, from];
    }

    const membersArray = members
      .split(",")
      .map(i => i.trim())
      .filter(i => i);

    try {
      const newGroup = {
        name: groupName,
        description,
        fromDate: from.toISOString().split("T")[0],
        toDate: to.toISOString().split("T")[0],
        img: uploadedImage || selectedImage || "",
        members: membersArray
      };

      console.log("Sending group Data:", newGroup);
  
      // Send the group data to the backend
      const response = await api.post("group/group/", newGroup);
      
   
      window.location.reload();
      onClose();
      if (onCreate) {
        onCreate();
      }

    } catch (err) {
      console.error("Group Creation failed:", err.response ? err.response.data : err);
      setError("Group Creation failed", getErrorMessage(err.response?.data));
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Create a New Group</h2>
        
        {error && <div className="error-message">{error}</div>}
        
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
        <input type="text" value={members} onChange={(e) => setMembers(e.target.value)} placeholder="Emails (comma-separated)" />
        <div className="invited-list">
          {members && members.split(",").map((email, idx) => (
            <p key={idx}>○ name — {email.trim()}</p>
          ))}
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
          <button className="create-btn" onClick={handleSubmit} disabled={isSubmitting}> {isSubmitting ? "Creating..." : "Create a Group"}</button>
        </div>
      </div>
    </div>
  );
};

export default GroupPopup;