import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SettingsPage.css";
import CalendarWidget from '../ui/CalendarWidget';

const SettingsPage = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("settings");

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth());
  const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    phone: "",
    email: "",
    profilePic: null,
    profilePicPreview: null,
  });

  // Calendar handled by CalendarWidget (state persisted)

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

  const monthName = new Date(
    currentYear,
    currentMonth
  ).toLocaleString("default", { month: "long" });

  return (
    <div className="settings-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">Hire A Helper</div>
        <ul className="sidebar-nav">
          <li
            className={activeNav === "feed" ? "active" : ""}
            onClick={() => {
              setActiveNav("feed");
              navigate("/feed");
            }}
          >
            Feed
          </li>
          <li
            className={activeNav === "myTasks" ? "active" : ""}
            onClick={() => {
              setActiveNav("myTasks");
              navigate("/my-tasks");
            }}
          >
            My Tasks
          </li>
          <li
            className={activeNav === "requests" ? "active" : ""}
            onClick={() => {
              setActiveNav("requests");
              navigate("/request");
            }}
          >
            Requests
          </li>
          <li
            className={activeNav === "myRequests" ? "active" : ""}
            onClick={() => {
              setActiveNav("myRequests");
              navigate("/my-request");
            }}
          >
            My Requests
          </li>
          <li
            className={activeNav === "addTask" ? "active" : ""}
            onClick={() => {
              setActiveNav("addTask");
              navigate("/add-task");
            }}
          >
            Add Task
          </li>
          <li
            className={activeNav === "settings" ? "active" : ""}
            onClick={() => {
              setActiveNav("settings");
              navigate("/settings");
            }}
          >
            Settings
          </li>
        </ul>

        {/* Calendar */}
        <CalendarWidget storageKey="calendar-widget" />
      </aside>

      {/* Main Content */}
      <main className="settings-main">
        <div className="settings-content">
          <h1 className="page-title" style={{textAlign: 'center'}}>Account</h1>
          <p className="settings-desc">Update your account settings.</p>

          {/* Profile Picture */}
          <div className="profile-pic-block">
            <div className="profile-pic-container">
              {formData.profilePicPreview ? (
                <img
                  src={formData.profilePicPreview}
                  alt="Profile"
                  className="profile-pic-preview"
                />
              ) : (
                <div className="profile-avatar">👤</div>
              )}
            </div>
            <div className="profile-pic-actions">
              <button
                type="button"
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
                type="button"
                className="btn-secondary"
                onClick={handleRemoveProfilePic}
                disabled={!formData.profilePicPreview}
              >
                Remove Photo
              </button>
            </div>
          </div>

          {/* Settings Form */}
          <form className="settings-form">
            <div className="form-group name-row">
              <div>
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                />
              </div>
              <div>
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
                placeholder="Enter your phone number"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                placeholder="Enter your email"
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
              <button type="submit" className="btn-primary">
                Save Changes
              </button>
              <button type="button" className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;

