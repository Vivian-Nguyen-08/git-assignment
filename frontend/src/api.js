import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 5000,
});

// Add request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNREFUSED') {
      console.error("Connection refused. Is the backend server running?");
      return Promise.reject(new Error("Cannot connect to server. Please make sure the backend is running."));
    }

    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("token_type");
      window.location.href = "/login";
    }

    console.error("Response error:", error);
    return Promise.reject(error);
  }
);

// API utility functions
export const addMemberToGroup = async (groupId, email) => {
  const response = await fetch(`http://127.0.0.1:8000/group/addMembers/?group_id=${groupId}&email=${email}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const errorData = await response.json(); 
    console.error("Failed to add member:", errorData.detail || "Unknown error occurred");
    throw new Error(errorData.detail || "Failed to add member");
  }

  return await response.json();
};

export const removeMemberFromGroup = async (groupId, email) => {
  const response = await fetch(`http://127.0.0.1:8000/group/removeMembers/?group_id=${groupId}&email=${email}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const errorData = await response.json(); 
    console.error("Failed to remove member:", errorData.detail || "Unknown error occurred");
    throw new Error(errorData.detail || "Failed to remove member");
  }

  return await response.json();
};

export const toggleArchiveStatus = async (groupId, archiveStatus) => {
  try {
    const response = await api.put(`/group/archive/${groupId}/?archive=${archiveStatus}`);
    return response.data;
  } catch (error) {
    console.error("Error toggling archive status:", error);
    throw error;
  }
};

export const getArchivedGroups = async () => {
  try {
    const response = await api.get("/group/my-archived-groups/");
    return response.data;
  } catch (error) {
    console.error("Error fetching archived groups:", error);
    throw error;
  }
};

export const toggleFavoriteStatus = async (groupId, archiveStatus) => {
  try {
    const response = await api.put(`/group/favorites/${groupId}/?favorite=${archiveStatus}`);
    return response.data;
  } catch (error) {
    console.error("Error toggling favorite status:", error);
    throw error;
  }
};

export const getFavoriteGroups = async () => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No access token found");

  try {
    const response = await api.get("/group/my-favorite-groups/");
    return response.data;
  } catch (error) {
    console.error("Error fetching favorite groups:", error);
    throw error;
  }
};

export default api;
