import React from "react";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getFavoriteGroups, toggleFavoriteStatus } from "../api";
import React from "react";

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const [favoriteEvents, setFavoriteEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFavoritesFromAPI = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await getFavoriteGroups();
        const apiFavorites = response.favorite_groups || [];

        setFavoriteEvents(apiFavorites);
        localStorage.setItem("favorites", JSON.stringify(apiFavorites));
      } catch (error) {
        console.error("Error fetching favorite groups:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavoritesFromAPI();
  }, []);

  const toggleFavorite = useCallback(
    async (event) => {
      try {
        const isFav = favoriteEvents.some((e) => e.id === event.id);

        if (typeof event.id === "number") {
          await toggleFavoriteStatus(event.id, !isFav);
        }

        setFavoriteEvents((prev) => {
          const updated = isFav
            ? prev.filter((e) => e.id !== event.id)
            : [...prev, event];

          localStorage.setItem("favorites", JSON.stringify(updated));
          return updated;
        });
      } catch (error) {
        console.error("Error toggling favorite status:", error);
      }
    },
    [favoriteEvents]
  );

  const isFavorited = useCallback(
    (id) => {
      return favoriteEvents.some((e) => e.id === id);
    },
    [favoriteEvents]
  );

  return (
    <FavoritesContext.Provider
      value={{
        favoriteEvents,
        toggleFavorite,
        isFavorited,
        isLoading,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
