import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import components
import LandingPage from './components/LandingPage/LandingPage';
import LoginPage from './components/LoginPage/LoginPage';
import SignupPage from './components/SignupPage/SignupPage';
import OtpPage from './components/OtpPage/OtpPage';
import ResetPasswordPage from './components/ResetPasswordPage/ResetPasswordPage';
import FeedPage from './components/FeedPage/FeedPage';
import MyTaskPage from './components/MyTaskPage/MyTaskPage';
import AddTaskPage from './components/AddTaskPage/AddTaskPage';
import RequestPage from './components/RequestPage/RequestPage';
import MyRequestPage from './components/MyRequestPage/MyRequestPage';
import SettingsPage from './components/SettingsPage/SettingsPage';
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify-otp" element={<OtpPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/my-tasks" element={<MyTaskPage />} />
          <Route path="/add-task" element={<AddTaskPage />} />
          <Route path="/request" element={<RequestPage />} />
          <Route path="/my-request" element={<MyRequestPage />} />
          <Route path="/settings" element={<SettingsPage/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
