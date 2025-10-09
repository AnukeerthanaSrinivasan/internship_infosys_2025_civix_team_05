import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./SettingsPage.css";
import '../ui/header.css';
import CalendarWidget from '../ui/CalendarWidget';

export default function SettingsPage() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("settings");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const profileRef = useRef(null);

  // Get user email
  useEffect(() => {
    const email = localStorage.getItem('email');
    if (email) setUserEmail(email);
  }, []);

  // Click outside profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    phone: "",
    email: "",
    profilePic: null,
    profilePicPreview: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        profilePic: file,
        profilePicPreview: URL.createObjectURL(file),
      });
    }
  };

  const handleRemoveProfilePic = () => {
    setFormData({
      ...formData,
      profilePic: null,
      profilePicPreview: null,
    });
  };

  return (
    <div className="feed-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">Hire A Helper</div>
        <nav className="sidebar-nav">
          <ul>
            <li onClick={() => navigate('/feed')}>Feed</li>
            <li onClick={() => navigate('/my-tasks')}>My Tasks</li>
            <li onClick={() => navigate('/request')}>Requests</li>
            <li onClick={() => navigate('/my-request')}>My Requests</li>
            <li onClick={() => navigate('/add-task')}>Add Task</li>
            <li className="active">Settings</li>
          </ul>
        </nav>
        <CalendarWidget storageKey="calendar-widget" />
      </div>

      {/* Main Content */}
      <div className="main-content1">
        <div className="task-card1">
          <h1 className="page-title" style={{textAlign: 'center'}}>Account Settings</h1>
          <p className="task-subtitle">Update your account settings and profile information</p>

          <div className="profile-section">
            <div className="profile-pic">
              {formData.profilePicPreview ? (
                <img
                  src={formData.profilePicPreview}
                  alt="Profile"
                  className="profile-img"
                />
              ) : (
                <div className="avatar">👤</div>
              )}
            </div>
            <div className="pic-buttons">
              <button
                className="btn-primary"
                onClick={() => document.getElementById("fileInput").click()}
              >
                Change Photo
              </button>
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleProfilePicChange}
              />
              <button
                className="btn-secondary"
                onClick={handleRemoveProfilePic}
                disabled={!formData.profilePicPreview}
              >
                Remove Photo
              </button>
            </div>
          </div>

          <form className="settings-form">
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
              />
            </div>

            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit">
                Save Changes
              </button>
              <button type="button" className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}