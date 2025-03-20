import React from "react";
import { Link } from "react-router-dom";
import "../pages/Login.css"; // Ensure correct path to CSS
import googleLogo from "../assets/google.png"; // Import Google logo
import globeLogo from "../assets/globe.png"; // Import Planora logo

const Login = () => {
  return (
    <div className="login-container">
      {/*  Navigation Bar with Planora Logo on Left and Links on Right */}
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

      {/*  Login Box */}
      <div className="login-box">
        <h2>Log In</h2>
        
        <label>Email</label>
        <input type="email" placeholder="Enter your email" />

        <label>Password</label>
        <input type="password" placeholder="Enter your password" />

        <button className="login-btn">Log In</button>

        <div className="separator">or</div>

        {/*  Google Sign-In Button */}
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
