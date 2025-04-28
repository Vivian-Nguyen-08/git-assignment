import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend
} from "recharts";
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

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c"];

const BudgetTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [history, setHistory] = useState([]);
  const [totalBudget, setTotalBudget] = useState(null);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showBudgetPrompt, setShowBudgetPrompt] = useState(false);
  const [profileImage, setProfileImage] = useState(null); 
  const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const eventName = location.state?.eventName || localStorage.getItem("lastEventName") || "XYZ";

         useEffect(() => {
           const storedImage = localStorage.getItem("profileImage"); // NEW
           if (storedImage) {
             setProfileImage(storedImage);
           }
         }, []);
  
  useEffect(() => {
    if (eventName) {
      localStorage.setItem("lastEventName", eventName);
    }
    const stored = JSON.parse(localStorage.getItem(`budgetData_${eventName}`)) || [];
    setHistory(stored);
    setExpenses(stored.slice(-5).reverse());

    const storedBudget = parseFloat(localStorage.getItem(`totalBudget_${eventName}`));
    if (!isNaN(storedBudget)) {
      setTotalBudget(storedBudget);
    } else {
      setShowBudgetPrompt(true);
    }
  }, [eventName]);

  const calculateRemaining = () => {
    const spent = history.reduce((sum, item) => sum + item.spent, 0);
    return (totalBudget - spent).toFixed(2);
  };

  const categoryData = history.reduce((acc, item) => {
    const categoryName = item.category.trim().toLowerCase();
    const existing = acc.find(d => d.name === categoryName);
    if (existing) {
      existing.value += item.spent;
    } else {
      acc.push({ name: categoryName, value: item.spent });
    }
    return acc;
  }, []);

  const renderModal = (title, onClose, content, onSubmit) => (
    <div className="modal-overlay">
      <div className="modal-popup">
        <h3>{title}</h3>
        <form onSubmit={onSubmit}>
          {content}
          <div className="modal-buttons">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="event-page">
      <div className="event-sidebar">
        <div className="sidebar-user">
        <img
            src={profileImage || profile_Icon}
            alt="User"
            className="user-icon"
          />
          <p>
            {firstName} {lastName}
          </p>
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
          <Link 
            to="/docs" 
            state={{ eventName: eventName }} 
            className="sidebar-link"
          >
            <img src={docs_Icon} alt="docs" className="sidebar-img" />
            <span>Docs</span>
          </Link>
          <Link to="/calendar" className="sidebar-link">
            <img src={calandar_Icon} alt="calendar" className="sidebar-img" />
            <span>Calendar</span>
          </Link>
          <Link to="/budget" className="sidebar-link">
            <img src={budget_Icon} alt="budget" className="sidebar-img" />
            <span>Budget</span>
          </Link>
          <Link to="/files" className="sidebar-link">
            <img src={file_Icon} alt="files" className="sidebar-img" />
            <span>Files</span>
          </Link>
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
                      <td>${e.spent.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="budget-box">
              <h2>Budget Breakdown</h2>
              <div className="pie-chart">
                {categoryData.length > 0 && totalBudget ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={80}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : '[Pie Chart Here]'}
              </div>
              <div className="bar-chart">
                {categoryData.length > 0 && totalBudget ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : '[Bar Chart Here]'}
              </div>
              <div className="amount-left">
                Amount Left: ${calculateRemaining()}
              </div>

              <div className="history-actions" style={{ marginTop: "20px" }}>
                <button className="action-btn" onClick={() => setShowExpenseModal(true)}>＋ Add Expense</button>
              </div>
            </div>

            <div className="side-panel">
              <div className="history-header-row">
                <h2>History</h2>
                <button onClick={() => navigate("/full-history", { state: { eventName } })} className="expand-arrow">➤</button>
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

              {showExpenseModal && renderModal("Add New Expense", () => setShowExpenseModal(false), (
                <>
                  <input name="subject" placeholder="Subject" required />
                  <input name="admin" placeholder="Administrator" required />
                  <input name="date" type="date" required />
                  <input name="description" placeholder="Description" required />
                  <input name="category" placeholder="Category" required />
                  <input name="spent" type="number" step="0.01" placeholder="Spent" required />
                </>
              ), (e) => {
                e.preventDefault();
                const form = e.target;
                const newExpense = {
                  subject: form.subject.value,
                  admin: form.admin.value,
                  date: form.date.value,
                  description: form.description.value,
                  category: form.category.value,
                  spent: parseFloat(form.spent.value),
                };
                const updatedHistory = [...history, newExpense];
                setHistory(updatedHistory);
                setExpenses(updatedHistory.slice(-5).reverse());
                localStorage.setItem(`budgetData_${eventName}`, JSON.stringify(updatedHistory));
                setShowExpenseModal(false);
              })}

              {showBudgetPrompt && renderModal("Set Your Total Budget", () => {}, (
                <>
                  <input type="number" step="0.01" placeholder="Enter your total budget" required name="budget" />
                </>
              ), (e) => {
                e.preventDefault();
                const amount = parseFloat(e.target.budget.value);
                setTotalBudget(amount);
                localStorage.setItem(`totalBudget_${eventName}`, amount);
                setShowBudgetPrompt(false);
              })}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetTracker;