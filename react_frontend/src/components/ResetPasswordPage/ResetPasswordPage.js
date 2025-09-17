import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ResetPasswordPage.css';
import resetImage from '../../assets/images/Resetpasswordimage.png';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Reset password request for:', email);
    
    // Here you would typically send a reset password request to your backend
    // For now, we'll just log it and navigate to the OTP verification page
    alert('OTP sent to your email!');
    navigate('/verify-otp');
  };

  return (
    <div className="reset-container">
      <div className="reset-form-container">
        <div className="reset-form">
          <h1>Reset Password?</h1>
          <p className="reset-description">Enter your email below to reset your password</p>
          
          <form id="resetForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                placeholder="me@example.com" 
                required 
                value={email}
                onChange={handleChange}
              />
            </div>
            
            <button type="submit" className="reset-button">Reset Password</button>
          </form>
          
          <div className="login-link">Back to <Link to="/login">Login</Link></div>
        </div>
      </div>
      
      <div className="reset-image">
        <img src={resetImage} alt="Reset Password Illustration" />
      </div>
    </div>
  );
};

export default ResetPasswordPage;