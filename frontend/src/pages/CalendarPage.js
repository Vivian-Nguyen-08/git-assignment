import React, { useState } from "react";
import "./CalendarPage.css";
import { Link } from "react-router-dom";
import EventModal from "./EventModal";

// Assets
import globeLogo from "../assets/globe.png";
import profile_Icon from "../assets/profile_Icon.png";
import home_Icon from "../assets/home_Icon.png";
import settings_Icon from "../assets/settings_Icon.png";
import bookmark_Icon from "../assets/bookmark_Icon.png";
import calandar_Icon from "../assets/calandar_Icon.png";
import archive_Icon from "../assets/archive_Icon.png";

const generateCalendar = (year, month) => {
  const startDay = new Date(year, month, 1).getDay();
  const weeks = [];
  let day = 1 - startDay;

  for (let w = 0; w < 6; w++) {
    const week = [];
    for (let d = 0; d < 7; d++, day++) {
      const date = new Date(year, month, day);
      week.push(date);
    }
    weeks.push(week);
  }
  return weeks;
};

const parseDate = (dateStr) => {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const CalendarPage = ({ customGroups = [], setCustomGroups }) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleNext = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  const handleDayClick = (date) => {
    const formatted = date.toISOString().split("T")[0];
    setSelectedDate(formatted);
    setShowModal(true);
  };

  const handleSaveEvent = (newEvent) => {
    const eventWithId = { ...newEvent, id: Date.now().toString() };
    setCustomGroups((prev) => [...prev, eventWithId]);
  };

  const toggleTaskComplete = (id) => {
    setCustomGroups((prev) =>
      prev.map((group) =>
        group.id === id ? { ...group, completed: !group.completed } : group
      )
    );
  };

  const handleDrop = (e, dropDate) => {
    const droppedId = e.dataTransfer.getData("text/plain");
    setCustomGroups((prev) =>
      prev.map((item) =>
        item.id === droppedId
          ? { ...item, fromDate: dropDate, toDate: null }
          : item
      )
    );
  };

  const weeks = generateCalendar(currentYear, currentMonth);


  const getGroupsForDate = (date) => {
    return customGroups.filter((group) => {
      if (!group.fromDate) return false;
      const from = parseDate(group.fromDate);
      const to = group.toDate ? parseDate(group.toDate) : from;
      return date >= from && date <= to;
    });
  };

  return (
    <div className="calendar-page">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-user">
          <img src={profile_Icon} alt="User" className="user-icon" />
          {!sidebarCollapsed && <p>User Name</p>}
        </div>

        <div className="sidebar-links">
          <Link to="/dashboard" className="sidebar-link">
            <img src={home_Icon} alt="dashboard" className="sidebar-icon" />
            {!sidebarCollapsed && <span>Dashboard</span>}
          </Link>
          <Link to="/settings" className="sidebar-link">
            <img src={settings_Icon} alt="settings" className="sidebar-icon" />
            {!sidebarCollapsed && <span>Settings</span>}
          </Link>
          <Link to="/favorites" className="sidebar-link-fav">
            <img src={bookmark_Icon} alt="favorites" className="sidebar-icon-fav" />
            {!sidebarCollapsed && <span>Favorites</span>}
          </Link>
          <Link to="/calendar" className="sidebar-link active">
            <img src={calandar_Icon} alt="calendar" className="sidebar-icon" />
            {!sidebarCollapsed && <span>Calendar</span>}
          </Link>
          <Link to="/archive" className="sidebar-link">
            <img src={archive_Icon} alt="archive" className="sidebar-icon" />
            {!sidebarCollapsed && <span>Archive</span>}
          </Link>
        </div>

        <button className="collapse-btn" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
          {sidebarCollapsed ? "→" : "←"}
        </button>
      </div>

      {/* Main Panel */}
      <div className="calendar-main">
        <div className="calendar-top-nav">
          <Link to="/">
            <img src={globeLogo} alt="Planora Logo" className="nav-logo" />
          </Link>
          <h2 className="calendar-title">Calendar</h2>
          <div className="nav-links">
            <Link to="/about">About Us</Link>
            <Link to="/resources">Resources</Link>
            <button className="account-btn">My Account ⌄</button>
          </div>
        </div>

        <div className="calendar-header">
          <button onClick={handlePrev}>←</button>
          <h3>
            {new Date(currentYear, currentMonth).toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h3>
          <button onClick={handleNext}>→</button>
          <button className="today-btn" onClick={handleToday}>Today</button>
        </div>

        <div className="calendar-grid">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="calendar-day-label">{day}</div>
          ))}

          {weeks.flat().map((date, idx) => {
            const isCurrentMonth = date.getMonth() === currentMonth;
            const isToday = date.toDateString() === today.toDateString();
            const groupsForDate = getGroupsForDate(date);
            const dropDate = date.toISOString().split("T")[0];

            return (
              <div
                key={idx}
                className={`calendar-cell ${!isCurrentMonth ? "dimmed" : ""} ${
                  isToday ? "today" : ""
                }`}
                onClick={() => handleDayClick(date)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, dropDate)}
              >
                <div className="calendar-day-number">{date.getDate()}</div>

                {groupsForDate.map((group, index) => (
                  <div
                    key={index}
                    className={`calendar-event-label ${
                      group.type === "task" ? "task-label" : "event-label"
                    } ${group.completed ? "completed" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (group.type === "task") toggleTaskComplete(group.id);
                    }}
                    draggable={group.type === "task"}
                    onDragStart={(e) =>
                      e.dataTransfer.setData("text/plain", group.id)
                    }
                  >
                    {group.name}
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        <footer className="calendar-footer">
          <div>Planora</div>
          <div>Support</div>
        </footer>

        {showModal && (
          <EventModal
            selectedDate={selectedDate}
            onClose={() => setShowModal(false)}
            onSave={handleSaveEvent}
          />
        )}
      </div>
    </div>
  );
};

export default CalendarPage;
