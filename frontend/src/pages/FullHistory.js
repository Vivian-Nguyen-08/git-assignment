import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/BudgetTracker.css";

const FullHistory = () => {
  const [history, setHistory] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const eventName = location.state?.eventName || "XYZ";

  const getBudgetKey = (name) => `budgetData_${name}`;
  const getTotalKey = (name) => `totalBudget_${name}`;

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(getBudgetKey(eventName))) || [];
    setHistory(stored);
  }, [eventName]);

  const handleCheckboxChange = (index) => {
    setSelectedItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleDelete = () => {
    const updatedHistory = history.filter((_, idx) => !selectedItems.includes(idx));
    setHistory(updatedHistory);
    localStorage.setItem(getBudgetKey(eventName), JSON.stringify(updatedHistory));
    setSelectedItems([]);
  };

  const handleResetBudget = () => {
    localStorage.removeItem(getBudgetKey(eventName));
    localStorage.removeItem(getTotalKey(eventName));
    window.location.reload();
  };

  return (
    <div className="main-content">
      <div className="top-nav">
        <button onClick={() => navigate("/budget", { state: { eventName } })} className="account-btn">
          ← Back to Budget
        </button>
        <h1>Full Expense History</h1>
        {selectedItems.length > 0 && (
          <button className="action-btn" onClick={handleDelete}>
            🗑️ Delete Selected
          </button>
        )}
      </div>
      <div className="history-box" style={{ marginTop: "20px" }}>
        <div className="history-scroll">
          <div className="history-header">
            <span>Date</span>
            <span>Description</span>
            <span>Category</span>
            <span>Spent</span>
          </div>
          {history.map((item, idx) => (
            <div key={idx} className="history-item">
              <input
                type="checkbox"
                checked={selectedItems.includes(idx)}
                onChange={() => handleCheckboxChange(idx)}
              />
              <span style={{ whiteSpace: "nowrap" }}>{item.date}</span>
              <span
                style={{
                  maxWidth: "120px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {item.description}
              </span>
              <span>{item.category}</span>
              <span>${item.spent.toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="history-actions">
          <button
            className="action-btn"
            style={{ backgroundColor: "#ec8686", borderColor: "#ec8686", marginTop: "20px" }}
            onClick={() => setShowResetConfirm(true)}
          >
            🔁 Reset Budget
          </button>
        </div>
      </div>

      {showResetConfirm && (
        <div className="modal-overlay">
          <div className="modal-popup">
            <h3>Confirm Reset</h3>
            <p>Are you sure you want to clear all expenses and your budget?</p>
            <div className="modal-buttons">
              <button onClick={() => setShowResetConfirm(false)}>Cancel</button>
              <button onClick={handleResetBudget}>Reset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FullHistory;
