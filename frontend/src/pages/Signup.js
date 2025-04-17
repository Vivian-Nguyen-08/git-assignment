import React, { useState } from "react";  
import { Link, useNavigate  } from "react-router-dom";
import "../styles/Signup.css"; 
import globeLogo from "../assets/globe.png"; 
import api from "../api";

const Signup = () => {
  const [name, setName] = useState(""); 
  const [lastName, setLastName] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
        
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
        
    try {
      const userData = {
        username: email,
        email: email,
        password: password,
        number: number,
        name: name,
        last_name: lastName,
        groups: [],
      };
  
      console.log("Sending data:", userData);
      
      const response = await api.post("auth/register/", userData);
                      
      console.log("Signup successful:", response);
      navigate("/login");
    } catch (err) {
      console.error("Signup failed:", err);
      
      if (err.response) {
        // Server responded with an error
        console.error("Error response:", err.response);
        setError(`Error: ${err.response.status} - ${JSON.stringify(err.response.data)}`);
      } else if (err.request) {
        // Request was made but no response received
        console.error("No response received");
        setError("Network error: Could not connect to the server");
      } else {
        // Something else happened
        setError(`Error: ${err.message}`);
      }
    }
  };

  return (
    <div className="signup-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <Link to="/">
          <img src={globeLogo} alt="Planora Logo" className="nav-logo" />
        </Link>
        <div className="nav-links">
          <Link to="/about" className="nav-link">About Us</Link>
          <Link to="/resources" className="nav-link">Resources</Link>
          <Link to="/login">
            <button className="login-btn">Log In</button>
          </Link>
        </div>
      </nav>

      {/* Signup Form */}
      <div className="signup-box">
        <h2>Create an Account</h2>

        {error && <p className="error-message">{error}</p>}

        <div className="input-group">
          <input  type="text" placeholder="First name" value={name} onChange={(e) => setName(e.target.value)}/>
          <input type="text" placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)}/>
        </div>

        <div className="input-group">
          <input type="tel" placeholder="Phone number" value={number} onChange={(e) => setNumber(e.target.value)}/>
          <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)}/>
        </div>

        <div className="input-group">
         <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
         <input type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
        </div>

        {error && <div className="error-message">{error}</div>}
        <button className="signup-btn"  onClick={handleSignup}>Sign Up</button>
      </div>

      {/* Footer */}
      <footer>
        <p>Planora</p>
        <p>Support</p>
      </footer>
    </div>
  );
};

export default Signup;