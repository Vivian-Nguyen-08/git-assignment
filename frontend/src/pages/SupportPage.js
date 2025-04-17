import React, { useState } from "react";  
import { Link } from "react-router-dom";
import "../styles/Signup.css"; 
import globeLogo from "../assets/globe.png"; 

const SupportPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    issues: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) return "First name is required.";
    if (!formData.lastName.trim()) return "Last name is required.";
    if (!formData.phoneNumber.trim()) return "Phone number is required.";
    if (!formData.email.trim()) return "Email address is required.";
    if (!/\S+@\S+\.\S+/.test(formData.email)) return "Invalid email format.";
    if (!formData.issues.trim()) return "Please describe your issue or concern.";
    
    return null;  // No errors
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      alert(error);  // Google Chrome-style alert
    } else {
      alert("Form submitted successfully!");
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
        <h2>Support Page</h2>
    
        <div className="input-group">
          <input 
            type="text" 
            placeholder="First name" 
            name="firstName" 
            value={formData.firstName} 
            onChange={handleChange} 
          />
          <input 
            type="text" 
            placeholder="Last name" 
            name="lastName" 
            value={formData.lastName} 
            onChange={handleChange} 
          />
        </div>
    
        <div className="input-group">
          <input 
            type="tel" 
            placeholder="Phone number" 
            name="phoneNumber" 
            value={formData.phoneNumber} 
            onChange={handleChange} 
          />
          <input 
            type="email" 
            placeholder="Email address" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
          />
        </div>
    
        <div className="input-group">
          <textarea 
            placeholder="Issues or Concerns" 
            name="issues" 
            value={formData.issues} 
            onChange={handleChange} 
            style={{ width: "400px", height: "150px" }} 
          />
        </div>
    
        <button className="signup-btn" onClick={handleSubmit}>Submit</button>
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
