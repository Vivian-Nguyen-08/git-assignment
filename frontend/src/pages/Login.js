import React, { useState } from "react";  
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import globeLogo from "../assets/globe.png";
import api from "../api";

const Login = () => {
  const [email, setEmail] = useState(""); // can be username or email
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); 

  const handleLogin = async () => {
    try {
      const userData = {
        username: email,
        password: password,
      };

      console.log("Sending data:", userData);
      
      const response = await api.post("auth/login/", userData);
  
      if (response.data.access_token) {
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("token_type", response.data.token_type || "bearer");
        navigate("/dashboard");
      } else {
        setError("Invalid response from server");
      }
    } catch (err) {
      console.error("Login failed:", err);
      if (err.message.includes("Cannot connect to server")) {
        setError("Cannot connect to server. Please make sure the backend is running.");
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Login failed. Please check your credentials and try again.");
      }
    }
  };

  return (
    <div className="login-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/">
            <img src={globeLogo} alt="Planora Logo" className="nav-logo" />
          </Link>
        </div>
        <div className="navbar-right">
          <Link to="/about" className="nav-link">About Us</Link>
          <Link to="/signup">
            <button className="signup-btn">Sign Up</button>
          </Link>
        </div>
      </nav>

      {/* Login Box */}
      <div className="login-box">
        <h2>Log In</h2>
        
        <label htmlFor="email">Username or Email</label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email or username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <div className="error-message">{error}</div>}

        <button className="login-btn" onClick={handleLogin}>Log In</button>

        <div className="separator">or</div>

        <p className="register-text">
          Don't have an account? <Link to="/signup" className="signup-link">Create One Here</Link>
        </p>
      </div>

      {/* Footer */}
      <footer>
        <p>Planora</p>
        <p><Link to="/support">Support</Link></p>
      </footer>
    </div>
  );
};

export default Login;
