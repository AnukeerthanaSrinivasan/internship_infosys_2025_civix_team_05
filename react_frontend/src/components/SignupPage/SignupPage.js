import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SignupPage.css';
import signupImage from '../../assets/images/signup image.webp';

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData), // sending signup data
    });

    const data = await response.json();
    if (response.ok) {
      alert("Signup successful! OTP sent to your email.");
      navigate("/verify-otp", { state: { email: formData.email } }); 
    } else {
      alert(data.error || "Signup failed");
    }
  } catch (error) {
    console.error("Error during signup:", error);
    alert("Something went wrong!");
  }
  };


  return (
    <div className="signup-container">
      <div className="signup-form-container">
        <div className="signup-form">
          <h1>SignUp</h1>
          <p className="signup-description">Enter your information to create an account</p>
          
          <form id="signupForm" onSubmit={handleSubmit}>
            <div className="name-fields">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input 
                  type="text" 
                  id="firstName" 
                  placeholder="Max" 
                  required 
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input 
                  type="text" 
                  id="lastName" 
                  placeholder="Robinson" 
                  required 
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
            
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
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                required 
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            
            <button type="submit" className="signup-button">Create an account</button>
          </form>
          
          <button className="google-signup">Sign up with Google</button>
          
          <p className="login-link">Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
      
      <div className="signup-image">
        <img src={signupImage} alt="Signup Illustration" />
      </div>
    </div>
  );
};

export default SignupPage;