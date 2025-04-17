// BudgetTracker.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/BudgetTracker.css";
import "../styles/EventPage.css";
import "../styles/EventNavbar.css";

// Assets
import profile_Icon from "../assets/profile_Icon.png";
import calandar_Icon from "../assets/calandar_Icon.png";
import docs_Icon from "../assets/docs_Icon.png";
import chat_Icon from "../assets/chat_Icon.png";
import edit_Icon from "../assets/edit_Icon.png";
import budget_Icon from "../assets/budget_Icon.png";
import logo from "../assets/globe.png";
import file_Icon from "../assets/file_Icon.png";
import home_Icon from "../assets/home_Icon.png";

const BudgetTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const eventName = location.state?.eventName || "XYZ";

  useEffect(() => {
    setExpenses([
      { subject: "Office Supplies", admin: "John Smith", date: "03/09/25", amount: 64.71 },
      { subject: "Office Supplies", admin: "John Smith", date: "03/09/25", amount: 64.71 },
      { subject: "Office Supplies", admin: "John Smith", date: "03/09/25", amount: 64.71 },
      { subject: "Office Supplies", admin: "John Smith", date: "03/09/25", amount: 64.71 },
      { subject: "Office Supplies", admin: "John Smith", date: "03/09/25", amount: 64.71 },
    ]);
    setHistory([
      { date: "03/10/25", description: "Grocery Food List", category: "Food", spent: 374.32 },
      { date: "03/09/25", description: "Grocery Food List", category: "Food", spent: 374.32 },
      { date: "03/10/25", description: "Grocery Food List", category: "Food", spent: 374.32 },
      { date: "03/09/25", description: "Grocery Food List", category: "Food", spent: 374.32 },
      { date: "03/10/25", description: "Grocery Food List", category: "Food", spent: 374.32 },
      { date: "03/09/25", description: "Grocery Food List", category: "Food", spent: 374.32 },
      { date: "03/10/25", description: "Grocery Food List", category: "Food", spent: 374.32 },
      { date: "03/09/25", description: "Grocery Food List", category: "Food", spent: 374.32 },
      { date: "03/10/25", description: "Grocery Food List", category: "Food", spent: 374.32 },
      { date: "03/09/25", description: "Grocery Food List", category: "Food", spent: 374.32 },
      { date: "03/10/25", description: "Grocery Food List", category: "Food", spent: 374.32 },
      { date: "03/09/25", description: "Grocery Food List", category: "Food", spent: 374.32 },
    ]);
  }, []);

  return (
    <div className="event-page">
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
          <Link to="/chat" className="sidebar-link">
            <img src={chat_Icon} alt="chat" className="sidebar-img" />
            <span>Chat</span>
          </Link>
          <Link to="/docs" className="sidebar-link">
            <img src={docs_Icon} alt="docs" className="sidebar-img" />
            <span>Docs</span>
          </Link>
          <div className="sidebar-link">
            <img src={calandar_Icon} alt="calendar" className="sidebar-img" />
            <span>Calendar</span>
          </div>
          <Link to="/budget" className="sidebar-link">
            <img src={budget_Icon} alt="budget" className="sidebar-img" />
            <span>Budget</span>
          </Link>
          <Link to="/files" className="sidebar-link">
            <img src={file_Icon} alt="files" className="sidebar-img" />
            <span>Files</span>
          </Link>
          <div className="sidebar-link">
            <img src={edit_Icon} alt="edit" className="sidebar-img" />
            <span>Edit</span>
          </div>
        </div>
      </div>

      <div className="budget-dashboard" style={{ overflowY: "auto", height: "100vh" }}>
        <div className="main-content">
          <div className="top-nav">
            <img src={logo} alt="Planora Logo" className="logo" />
            <div className="nav-right">
              <Link to="/about">About Us</Link>
              <Link to="/resources">Resources</Link>
              <button className="account-btn">My Account ⌄</button>
            </div>
          </div>

          <h1 className="title">{eventName} Budget Tracker</h1>

          <div className="content-grid">
            <div className="expenses-box">
              <h2>Recent Expenses</h2>
              <table>
                <thead>
                  <tr><th>Subject</th><th>Administrator</th><th>Date</th><th>Payment</th></tr>
                </thead>
                <tbody>
                  {expenses.map((e, idx) => (
                    <tr key={idx}>
                      <td>{e.subject}</td>
                      <td>{e.admin}</td>
                      <td>{e.date}</td>
                      <td>${e.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="budget-box">
              <h2>Budget Breakdown</h2>
              <div className="pie-chart">[Pie Chart Here]</div>
              <div className="bar-chart">[Bar Chart Here]</div>
              <div className="amount-left">Amount Left: $1,965.54</div>
            </div>

            <div className="side-panel">
              <div className="history-header-row">
                <h2>History</h2>
                <button onClick={() => navigate("/full-history")} className="expand-arrow">➤</button>
              </div>
              <div className="history-box">
                <div className="history-scroll">
                <div className="history-header">
                  <span>Date</span>
                  <span>Description</span>
                  <span>Category</span>
                  <span>Spent</span>
                </div>
                  {history.map((item, idx) => (
                    <div key={idx} className="history-item">
                      <input type="checkbox" />
                      <span>{item.date}</span>
                      <span>{item.description}</span>
                      <span>{item.category}</span>
                      <span>${item.spent.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="history-actions">
                <button className="action-btn">＋ Add Expense</button>
                <button className="action-btn">＋ Input Receipt</button>
                <button className="action-btn">＋ Add Category</button>
                <button className="action-btn">＋ Create Report</button>
              </div>
            </div>
          </div> 
        </div>
      </div>
    </div>
  );
};

export default BudgetTracker;
