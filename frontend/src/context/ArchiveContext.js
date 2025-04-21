import React, { createContext, useContext, useEffect, useState } from "react";

const ArchiveContext = createContext();

export const ArchiveProvider = ({ children }) => {
  const [archivedEvents, setArchivedEvents] = useState(() => {
    const stored = localStorage.getItem("archivedEvents");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("archivedEvents", JSON.stringify(archivedEvents));
  }, [archivedEvents]);

  const archiveEvent = (event) => {
    setArchivedEvents((prev) => [...prev, event]);
  };

  const unarchiveEvent = (eventId) => {
    setArchivedEvents((prev) => prev.filter((e) => e.id !== eventId));
  };

  const isArchived = (eventId) => {
    return archivedEvents.some((e) => e.id === eventId);
  };

  return (
    <ArchiveContext.Provider
      value={{
        archivedEvents,
        archiveEvent,
        unarchiveEvent, 
        isArchived,
      }}
    >
      {children}
    </ArchiveContext.Provider>
  );
};

export const useArchive = () => useContext(ArchiveContext);
