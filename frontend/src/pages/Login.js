import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../pages/Login.css";
import googleLogo from "../assets/google.png";
import globeLogo from "../assets/globe.png";

const Login = () => {
  const navigate = useNavigate();
  
  // Added state hooks to capture email/password and errors
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const response = await axios.post(
        "http://localhost:8000/login/",
        formData,
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      localStorage.setItem("token", response.data.access_token);
      navigate("/dashboard");

    } catch (err) {
      setError(err.response?.data?.detail || "Invalid credentials.");
    }
  };

  return (
    <div className="login-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <Link to="/">
          <img src={globeLogo} alt="Planora Logo" className="nav-logo" />
        </Link>
        <div className="nav-links">
          <Link to="/about" className="nav-link">About Us</Link>
          <Link to="/resources" className="nav-link">Resources</Link>
          <Link to="/signup">
            <button className="signup-btn">Sign Up</button>
          </Link>
        </div>
      </nav>

      {/* Login Box */}
      <div className="login-box">
        <h2>Log In</h2>
        
        <label>Username</label>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="error-message">{error}</p>}

        <button className="login-btn" onClick={handleLogin}>Log In</button>

        <div className="separator">or</div>

        <button className="google-btn">
          <img src={googleLogo} alt="Google" className="google-logo" />
          Sign in with Google
        </button>

        <p className="register-text">
          Don’t have an account? <Link to="/signup" className="signup-link">Create One Here</Link>
        </p>
      </div>

      {/* Footer */}
      <footer>
        <p>Planora</p>
        <p>Support</p>
      </footer>
    </div>
  );
};

export default Login;
