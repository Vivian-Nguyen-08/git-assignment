import React, { useState } from "react";  
import { Link, useNavigate  } from "react-router-dom";
import "../pages/Signup.css"; // Ensure correct path to CSS
import globeLogo from "../assets/globe.png"; // Import Planora logo
import api from "../api";

const Signup = () => {
  const [name, setName] = useState(""); 
  const [lastName, setLastName] = useState("");
  const [number, SetNumber] = useState("");
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

    // Send the registration request using the API module
    try {
      const response = await api.post("auth/register", {

        username: email,         
        email: email,            
        password_hash: password, 
        number: number,          
        name: name,            
        last_name: lastName 
        
      });
      
      // If successful registration, navigate to login page
      console.log("Signup successful:", response);
      navigate("/Login");  // Redirect to login page
    } catch (err) {
      console.error("Signup failed:", err.response ? err.response.data : err);
      setError("Something went wrong, please try again.");
    }
  };

  return (
    <div className="signup-container">
      {/* ✅ Navigation Bar with Planora Logo on Left and Links on Right */}
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

      {/* ✅ Signup Box */}
      <div className="signup-box">
        <h2>Create an Account</h2>

        <div className="input-group">
          <input type="text" placeholder="First name" />
          <input type="text" placeholder="Last name" />
        </div>

        <div className="input-group">
          <input type="tel" placeholder="Phone number" />
          <input type="email" placeholder="Email address" />
        </div>

        <div className="input-group">
          <input type="password" placeholder="Password" />
          <input type="password" placeholder="Confirm password" />
        </div>

        <button className="signup-btn"  onClick={handleSignup}>Sign Up</button>
      </div>

      {/* ✅ Footer */}
      <footer>
        <p>Planora</p>
        <p>Support</p>
      </footer>
    </div>
  );
};

export default Signup;
