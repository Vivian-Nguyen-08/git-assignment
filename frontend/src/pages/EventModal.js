import React, { useState, useEffect } from "react";
import "../styles/EventModal.css";

const EventModal = ({ selectedDate, event, onClose, onSave, onDelete, isEditing }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("event");
  const [fromDate, setFromDate] = useState(selectedDate);
  const [toDate, setToDate] = useState(selectedDate);

  useEffect(() => {
    if (isEditing && event) {
      setName(event.name);
      setType(event.type);
      setFromDate(event.fromDate);
      setToDate(event.toDate || event.fromDate);
    } else {
      setName("");
      setType("event");
      setFromDate(selectedDate);
      setToDate(selectedDate);
    }
  }, [event, isEditing, selectedDate]);

  const handleSubmit = () => {
    const newEvent = {
      id: isEditing ? event.id : Date.now().toString(),
      name,
      fromDate,
      toDate: type === "event" ? toDate : null,
      type,
      completed: isEditing ? event.completed : false,
    };
    onSave(newEvent);
    onClose();
  };

  const handleDelete = () => {
    onDelete(event.id);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>{isEditing ? "Edit Event" : "Add Event/Task"}</h2>

        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="event">Event</option>
          <option value="task">Task</option>
        </select>

        {type === "event" && (
          <>
            <label className="date-label">Start Date:</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <label className="date-label">End Date:</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </>
        )}

        <div className="modal-actions">
          <button className="save-btn" onClick={handleSubmit}>
            {isEditing ? "Update" : "Save"}
          </button>

          {isEditing && (
            <button className="delete-btn" onClick={handleDelete}>
              Delete
            </button>
          )}

          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
