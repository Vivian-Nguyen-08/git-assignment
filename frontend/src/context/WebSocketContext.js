import React, { createContext, useContext, useEffect, useState } from 'react';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Create WebSocket connection
    const ws = new WebSocket('ws://127.0.0.1:8000/ws/groups');

    ws.onopen = () => {
      console.log('WebSocket Connected');
      setSocket(ws);
    };

    ws.onclose = () => {
      console.log('WebSocket Disconnected');
      setSocket(null);
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    // Cleanup on unmount
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const socket = useContext(WebSocketContext);
  if (!socket) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return socket;
}; 