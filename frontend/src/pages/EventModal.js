import React, { useState, useEffect } from "react";
import "./EventModal.css";

const EventModal = ({ selectedDate, onClose, onSave, onDelete, editingEvent }) => {
  const [title, setTitle] = useState(editingEvent?.name || "");
  const [description, setDescription] = useState(editingEvent?.description || "");
  const [fromDate, setFromDate] = useState(editingEvent?.fromDate || selectedDate);
  const [toDate, setToDate] = useState(editingEvent?.toDate || selectedDate);
  const [type, setType] = useState(editingEvent?.type || "event");

  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.name);
      setDescription(editingEvent.description || "");
      setFromDate(editingEvent.fromDate);
      setToDate(editingEvent.toDate || editingEvent.fromDate);
      setType(editingEvent.type || "event");
    }
  }, [editingEvent]);

  const handleSave = () => {
    const newEvent = {
      id: editingEvent?.id || Date.now(),
      name: title,
      description,
      type,
      fromDate,
      toDate: type === "event" ? toDate : fromDate,
      complete: editingEvent?.complete || false
    };
    onSave(newEvent);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>{editingEvent ? `Edit ${type === "task" ? "Task" : "Event"}` : `Add ${type === "task" ? "Task" : "Event"}`}</h3>
        <input
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="modal-dates">
          <div>
            <label>From:</label>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </div>
          {type === "event" && (
            <div>
              <label>To:</label>
              <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </div>
          )}
        </div>
        <div className="modal-type-toggle">
          <button
            className={type === "event" ? "active" : ""}
            onClick={() => setType("event")}
          >
            Event
          </button>
          <button
            className={type === "task" ? "active" : ""}
            onClick={() => setType("task")}
          >
            Task
          </button>
        </div>
        <div className="modal-actions">
          {editingEvent && (
            <button className="delete-btn" onClick={() => onDelete(editingEvent.id)}>Delete</button>
          )}
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
