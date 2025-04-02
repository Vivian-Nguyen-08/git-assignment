import React from "react";  
import { Link } from "react-router-dom";
import "../styles/Signup.css"; 
import globeLogo from "../assets/globe.png"; 

const SupportPage = () => {
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
        <h2>Support Page</h2>
    
        <div className="input-group">
          <input type="text" placeholder="First name" />
          <input type="text" placeholder="Last name" />
        </div>
    
        <div className="input-group">
          <input type="tel" placeholder="Phone number" />
          <input type="email" placeholder="Email address" />
        </div>
    
        <div className="input-group">
        <textarea placeholder="Issues or Concerns" style={{ width: "400px", height: "150px" }} />

        </div>
    
        <button className="signup-btn">Submit</button>
      </div>
    
      {/* Footer */}
      <footer>
        <p>Planora</p>
        <p>Support</p>
      </footer>
    </div>
  )
}

export default SupportPage;
