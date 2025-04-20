import React from "react";
import { createContext, useContext, useState } from "react";

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const [favoriteEvents, setFavoriteEvents] = useState([]);

  const toggleFavorite = (event) => {
    setFavoriteEvents((prev) => {
      const exists = prev.find((e) => e.id === event.id);
      if (exists) return prev.filter((e) => e.id !== event.id);
      return [...prev, event];
    });
  };

  const isFavorited = (id) => favoriteEvents.some((e) => e.id === id);

  return (
    <FavoritesContext.Provider value={{ favoriteEvents, toggleFavorite, isFavorited }}>
      {children}
    </FavoritesContext.Provider>
  );
};
