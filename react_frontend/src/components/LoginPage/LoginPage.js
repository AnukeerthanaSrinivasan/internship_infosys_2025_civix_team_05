import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';
import loginImage from '../../assets/images/Loginpage image.png';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login successful!");
        localStorage.setItem("token", data.token); // store JWT token
        navigate("/feed"); // redirect after login
      } else {
        alert(data.error || "Invalid credentials");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/reset-password');
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <div className="login-form">
          <h1>Login</h1>
          <p className="login-description">
            Enter your email below to login to your account
          </p>
          
          <form id="loginForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                placeholder="me@example.com" 
                required 
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group password-group">
              <div className="password-header">
                <label htmlFor="password">Password</label>
                <a 
                  className="forgot-password" 
                  onClick={handleForgotPassword}
                >
                  Forgot your password?
                </a>
              </div>
              <input 
                type="password" 
                id="password" 
                required 
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            
            <button 
              type="submit" 
              className="login-button" 
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          
          <button className="google-login">Login with Google</button>
          <div 
            className="signup-link" 
            style={{position: 'static', display: 'block', marginTop: '20px'}}
          >
            Don't have an account? <Link to="/signup">Sign up</Link>
          </div>
        </div>
      </div>
      
      <div className="login-image">
        <img src={loginImage} alt="Login Illustration" />
      </div>
    </div>
  );
};

export default LoginPage;
