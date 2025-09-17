import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import landingPageImage from '../../assets/images/LandingPageImage.jpg';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  return (
    <div className="container">
      <div className="left-panel">
        <div className="logo">Hire A Helper</div>
        <div className="left-content">
          <p>Simplify your life with Hire a Helper. We match you with vetted helpers in your neighborhood who can tackle any task on your list. Trusted help is just a click away.</p>
        </div>
      </div>
      <div className="right-panel">
        <div className="signup-link" style={{position: 'absolute', top: '20px', right: '20px'}}>
          <a href="#" onClick={handleSignupClick}>Sign up</a>
        </div>
        <div className="content">
          <h1>Hire A Helper</h1>
          <p>Finding a helping hand should be easy. We connect you with trusted, local helpers so you can get your to-do list done and get back to what matters most.</p>
          <button className="login-btn" onClick={handleLoginClick}>Login</button>
          <div className="illustration">
            <img src={landingPageImage} alt="Helpers Illustration" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;