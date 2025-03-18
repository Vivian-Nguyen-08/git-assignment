import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/")  // Ensure this matches your backend URL
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setMessage("Error fetching backend.");
      });
  }, []);

  return (
    <div>
      <h1>React + FastAPI</h1>
      <p>Backend says: {message}</p>
    </div>
  );
}

export default App;
