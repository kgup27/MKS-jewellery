import React, { useState } from 'react';
import './LoginSignup.css';

// Import icons from the local Assets folder
import user_icon from './Assets/user.png';
import email_icon from './Assets/mail.png';
import password_icon from './Assets/locked-computer.png';

const LoginSignup = () => {
  const [action, setAction] = useState("Sign Up");
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className='container'>
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>
      
      <div className="inputs">
        {action === "Login" ? null : (
          <div className="input">
            <img src={user_icon} alt="User Icon" />
            <input 
              type="text" 
              name="name"
              placeholder="Name" 
              value={formData.name} 
              onChange={handleInputChange} 
            />
          </div>
        )}

        <div className="input">
          <img src={email_icon} alt="Email Icon" />
          <input 
            type="email" 
            name="email"
            placeholder="Email Id" 
            value={formData.email} 
            onChange={handleInputChange} 
          />
        </div>

        <div className="input">
          <img src={password_icon} alt="Password Icon" />
          <input 
            type="password" 
            name="password"
            placeholder="Password" 
            value={formData.password} 
            onChange={handleInputChange} 
          />
        </div>
      </div>

      {action === "Sign Up" ? null : (
        <div className="forgot-password">
          Lost password? <span>Click Here!</span>
        </div>
      )}

      <div className="submit-container">
        <div 
          className={action === "Login" ? "submit gray" : "submit"} 
          onClick={() => setAction("Sign Up")}
        >
          Sign Up
        </div>
        <div 
          className={action === "Sign Up" ? "submit gray" : "submit"} 
          onClick={() => setAction("Login")}
        >
          Login
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;