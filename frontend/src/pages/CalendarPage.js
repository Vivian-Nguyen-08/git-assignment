import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import EventModal from "./EventModal";
import "../styles/CalendarPage.css";
import api from "../api";

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
      week.push(new Date(year, month, day));
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [firstName, setFirstName] = useState(localStorage.getItem("firstName") || "User");
  const [lastName, setLastName] = useState(localStorage.getItem("lastName") || "Name");
  const [profileImage, setProfileImage] = useState(null); // NEW

  useEffect(() => {
    const storedImage = localStorage.getItem("profileImage");
    if (storedImage) {
      setProfileImage(storedImage);
    }
  }, []);

  const fetchUserInfo = async () => {
    const token = localStorage.getItem("access_token");
    const tokenType = localStorage.getItem("token_type") || "bearer";

    if (!token) return;

    try {
      const response = await api.get("/auth/users/me", {
        headers: {
          Authorization: `${tokenType} ${token}`,
        },
      });

      const { first_name, last_name } = response.data;

      localStorage.setItem("firstName", first_name);
      localStorage.setItem("lastName", last_name);

      setFirstName(first_name);
      setLastName(last_name);
    } catch (err) {
      console.error("Failed to fetch user info", err);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleNext = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
    setCurrentYear((prev) => (currentMonth === 11 ? prev + 1 : prev));
  };

  const handlePrev = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
    setCurrentYear((prev) => (currentMonth === 0 ? prev - 1 : prev));
  };

  const handleToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  const handleDayClick = (date) => {
    setSelectedDate(date.toISOString().split("T")[0]);
    setShowModal(true);
  };

  const handleSaveEvent = (newEvent) => {
    setCustomGroups((prev) => [
      ...prev,
      { ...newEvent, id: Date.now().toString() },
    ]);
  };

  const handleUpdateEvent = (updatedEvent) => {
    setCustomGroups((prev) =>
      prev.map((item) => (item.id === updatedEvent.id ? updatedEvent : item))
    );
  };

  const toggleTaskComplete = (id) => {
    setCustomGroups((prev) =>
      prev.map((group) =>
        group.id === id ? { ...group, completed: !group.completed } : group
      )
    );
  };

  const handleDelete = (id) => {
    setCustomGroups((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDrop = (e, dropDate) => {
    const droppedId = e.dataTransfer.getData("text/plain");
    setCustomGroups((prev) =>
      prev.map((item) =>
        item.id === droppedId && item.type === "event"
          ? { ...item, fromDate: dropDate, toDate: null }
          : item
      )
    );
  };

  const handleEventClick = (group) => {
    setSelectedEvent(group);
    setShowEditModal(true);
  };

  const getGroupsForDate = (date) =>
    customGroups.filter((group) => {
      if (!group.fromDate) return false;
      const from = parseDate(group.fromDate);
      const to = group.toDate ? parseDate(group.toDate) : from;
      return (
        date.toDateString() === from.toDateString() ||
        (group.type === "event" && date >= from && date <= to)
      );
    });

  const weeks = generateCalendar(currentYear, currentMonth);

  return (
    <div className="calendar-page">
      <div className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-user">
          <img src={profileImage || profile_Icon} alt="User" className="user-icon" />
          {!sidebarCollapsed && (
            <p>
              {firstName} {lastName}
            </p>
          )}
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

          <Link to="/favorites" className="sidebar-link">
            <img src={bookmark_Icon} alt="favorites" className="sidebar-icon" />
            {!sidebarCollapsed && <span>Favorites</span>}
          </Link>

          <Link
            to="/calendar"
            className="sidebar-link-fav"
            style={{ backgroundColor: "#cbe4f6", borderRadius: "10px" }}
          >
            <img
              src={calandar_Icon}
              alt="calendar"
              className="sidebar-icon-fav"
            />
            {!sidebarCollapsed && <span>Calendar</span>}
          </Link>

          <Link to="/archive" className="sidebar-link">
            <img src={archive_Icon} alt="archive" className="sidebar-icon" />
            {!sidebarCollapsed && <span>Archive</span>}
          </Link>
        </div>

        <button
          className="collapse-btn"
          data-testid="collapse-btn"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          {sidebarCollapsed ? "→" : "←"}
        </button>
      </div>

      <div className="calendar-main">
        <div className="calendar-header">
          <h1>Calendar</h1>
        </div>

        <div className="calendar-header">
          <h2>
            {new Date(currentYear, currentMonth).toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h2>

          <div className="calendar-nav-buttons">
            <button onClick={handlePrev}>←</button>
            <button onClick={handleNext}>→</button>
          </div>
          <button className="today-btn" onClick={handleToday}>
            Today
          </button>
        </div>

        <div className="calendar-grid">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="calendar-day-label">
              {day}
            </div>
          ))}
          {weeks.flat().map((date, idx) => (
            <div
              key={idx}
              className={`calendar-cell ${
                date.getMonth() !== currentMonth ? "dimmed" : ""
              } ${date.toDateString() === today.toDateString() ? "today" : ""}`}
              onClick={() => handleDayClick(date)}
              onDrop={(e) => handleDrop(e, date.toISOString().split("T")[0])}
              onDragOver={(e) => e.preventDefault()}
            >
              <div>{date.getDate()}</div>
              {getGroupsForDate(date).map((group) => (
                <div
                  key={group.id}
                  className={`calendar-event-label ${group.type}-label ${
                    group.completed ? "completed" : ""
                  }`}
                  draggable={group.type === "event"}
                  onDragStart={(e) =>
                    group.type === "event" &&
                    e.dataTransfer.setData("text/plain", group.id)
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    group.type === "task"
                      ? toggleTaskComplete(group.id)
                      : handleEventClick(group);
                  }}
                >
                  {group.name}
                </div>
              ))}
            </div>
          ))}
        </div>

        {showModal && (
          <EventModal
            selectedDate={selectedDate}
            onClose={() => setShowModal(false)}
            onSave={handleSaveEvent}
          />
        )}
        {showEditModal && (
          <EventModal
            event={selectedEvent}
            isEditing={true}
            onClose={() => setShowEditModal(false)}
            onSave={handleUpdateEvent}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default CalendarPage;
