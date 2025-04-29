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

const STOCK_IMAGE = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBjUYQJKzRWz-K_4dH1hokEXxgbf76i5lvSA&s";

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
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const CalendarPage = ({ customGroups, setCustomGroups }) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [firstName, setFirstName] = useState(localStorage.getItem("firstName") || "User");
  const [lastName, setLastName] = useState(localStorage.getItem("lastName") || "Name");

  useEffect(() => {
    fetchUserInfo();
    fetchEvents();
    const img = localStorage.getItem("profileImage");
    if (img) setProfileImage(img);
  }, []);

  const fetchUserInfo = async () => {
    const token = localStorage.getItem("access_token");
    const tokenType = localStorage.getItem("token_type") || "bearer";
    if (!token) return;
    try {
      const { data } = await api.get("/auth/users/me", {
        headers: { Authorization: `${tokenType} ${token}` },
      });
      localStorage.setItem("firstName", data.first_name);
      localStorage.setItem("lastName", data.last_name);
      setFirstName(data.first_name);
      setLastName(data.last_name);
    } catch (err) {
      console.error("Failed to fetch user info", err);
    }
  };

  const fetchEvents = async () => {
    try {
      const { data } = await api.get("group/my-groups/");
      const groups = data.groups.map((g) => ({
        id: g.id?.toString() || Date.now().toString(),
        name: g.name || "Untitled Event",
        type: "event",
        fromDate: g.fromDate || g.date || new Date().toISOString().split("T")[0],
        toDate: g.toDate || g.fromDate || g.date || new Date().toISOString().split("T")[0],
        completed: false,
        img: STOCK_IMAGE,
      }));
      setEvents(groups);
    } catch (err) {
      console.error("Failed to fetch events", err);
    }
  };

  const handleSaveEvent = (newEvent) => {
    const finalEvent = {
      ...newEvent,
      img: newEvent.type === "event" ? STOCK_IMAGE : null,
      completed: newEvent.completed || false,
    };
    setCustomGroups((prev) => [...prev, finalEvent]);
    setShowModal(false);
  };

  const handleUpdateEvent = async (updatedEvent) => {
    const token = localStorage.getItem("access_token");
    try {
      await api.put(`/events/${updatedEvent.id}`, updatedEvent, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEvents();
    } catch (err) {
      console.error("Error updating event", err);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("access_token");
    try {
      await api.delete(`/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEvents();
    } catch (err) {
      console.error("Error deleting event", err);
    }
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

  const handleDayClick = (date) => {
    setSelectedDate(date.toISOString().split("T")[0]);
    setShowModal(true);
  };

  const toggleTaskComplete = (id) => {
    setCustomGroups((prev) =>
      prev.map((g) =>
        g.id === id ? { ...g, completed: !g.completed } : g
      )
    );
  };

  const getGroupsForDate = (date) =>
    [...customGroups, ...events].filter((ev) => {
      const from = parseDate(ev.fromDate);
      const to = ev.toDate ? parseDate(ev.toDate) : from;
      return date >= from && date <= to;
    });

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };
  const handleToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  const weeks = generateCalendar(currentYear, currentMonth);

  return (
    <div className="calendar-page">
      {/* Sidebar fully kept */}
      <div className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-user">
          <img src={profileImage || profile_Icon} alt="User" className="user-icon" />
          {!sidebarCollapsed && (<p>{firstName} {lastName}</p>)}
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
          <Link to="/calendar" className="sidebar-link-fav" style={{ backgroundColor: "#cbe4f6", borderRadius: "10px" }}>
            <img src={calandar_Icon} alt="calendar" className="sidebar-icon-fav" />
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

      {/* Main Calendar Panel fully kept */}
      <div className="calendar-main">
        <div className="calendar-header">
          <div className="month-navigation">
            <h1>{new Date(currentYear, currentMonth).toLocaleString("default", { month: "long", year: "numeric" })}</h1>
            <button onClick={handlePreviousMonth} className="arrow-btn">←</button>
            <button onClick={handleNextMonth} className="arrow-btn">→</button>
            <button onClick={handleToday} className="today-btn">Today</button>
          </div>
        </div>

        <div className="calendar-grid">
          {[
            "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
          ].map((d) => (
            <div key={d} className="calendar-day-label">{d}</div>
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
              {getGroupsForDate(date).map((group) => {
             const isStart = parseDate(group.fromDate).toDateString() === date.toDateString();
             const isEnd = group.toDate
               ? parseDate(group.toDate).toDateString() === date.toDateString()
               : false;
             
                return (
                  <div
                    key={group.id}
                    className={`calendar-event-label ${group.type}-label ${group.completed ? "completed" : ""} ${isStart ? "start-of-event" : ""} ${isEnd ? "end-of-event" : ""}`}
                    draggable={group.type === "event"}
                    onDragStart={(e) => e.dataTransfer.setData("text/plain", group.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      group.type === "task"
                        ? toggleTaskComplete(group.id)
                        : handleEventClick(group);
                    }}
                  >
                    {group.name}
                  </div>
                );
              })}
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
            isEditing
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
