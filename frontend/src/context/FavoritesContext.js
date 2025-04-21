import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getFavoriteGroups, toggleFavoriteStatus } from '../api';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const [favoriteEvents, setFavoriteEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch favorites only once when component mounts
  useEffect(() => {
    // Load favorites from localStorage
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavoriteEvents(JSON.parse(storedFavorites));
    }
    
    // Fetch favorites from API
    const fetchFavoritesFromAPI = async () => {
      setIsLoading(true);
      try {
        const response = await getFavoriteGroups();
        const apiFavorites = response.favorite_groups || [];
        
        setFavoriteEvents(prev => {
          const mergedFavorites = [...prev];
          
          // Add API favorites that aren't already in the list
          apiFavorites.forEach(apiFav => {
            if (!mergedFavorites.some(existing => existing.id === apiFav.id)) {
              mergedFavorites.push(apiFav);
            }
          });
          
          // Save to localStorage
          localStorage.setItem('favorites', JSON.stringify(mergedFavorites));
          return mergedFavorites;
        });
      } catch (error) {
        console.error("Error fetching favorite groups:", error);
        // Don't update state on error
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFavoritesFromAPI();
  }, []); // Empty dependency array means this runs once on mount
  
  // Memoize these functions to prevent unnecessary re-renders
  const toggleFavorite = useCallback(async (event) => {
    try {
      // If the event has a numeric ID, it might be from the backend
      if (typeof event.id === 'number') {
        // Get current favorite status
        const isFav = favoriteEvents.some(e => e.id === event.id);
        // Toggle in backend
        await toggleFavoriteStatus(event.id, !isFav);
      }
      
      // Update local state
      setFavoriteEvents(prev => {
        const exists = prev.find(e => e.id === event.id);
        const newFavorites = exists 
          ? prev.filter(e => e.id !== event.id)
          : [...prev, event];
          
        // Update localStorage
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
        return newFavorites;
      });
    } catch (error) {
      console.error("Error toggling favorite status:", error);
    }
  }, [favoriteEvents]);
  
  const isFavorited = useCallback((id) => {
    return favoriteEvents.some(e => e.id === id);
  }, [favoriteEvents]);
  
  return (
    <FavoritesContext.Provider value={{ 
      favoriteEvents, 
      toggleFavorite, 
      isFavorited,
      isLoading
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};