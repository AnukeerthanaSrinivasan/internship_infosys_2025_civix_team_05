import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SettingsPage.css";

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

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 0) {
        setCurrentYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 11) {
        setCurrentYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  const generateCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
    const days = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: daysInPrevMonth - i, currentMonth: false });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, currentMonth: true, selected: i === selectedDate.getDate() });
    }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, currentMonth: false });
    }
    return days;
  };

  const handleDateSelect = (day, isCurrentMonth) => {
    if (isCurrentMonth) {
      const newDate = new Date(currentYear, currentMonth, day);
      setSelectedDate(newDate);
      setFormData({ ...formData, dob: newDate.toISOString().split("T")[0] });
    }
  };

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

  const monthName = new Date(currentYear, currentMonth).toLocaleString("default", { month: "long" });

  return (
    <div className="settings-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">Hire A Helper</div>
        <ul className="sidebar-nav">
          <li className={activeNav === "feed" ? "active" : ""} onClick={() => { setActiveNav("feed"); navigate("/feed"); }}>Feed</li>
          <li className={activeNav === "myTasks" ? "active" : ""} onClick={() => { setActiveNav("myTasks"); navigate("/my-tasks"); }}>My Tasks</li>
          <li className={activeNav === "requests" ? "active" : ""} onClick={() => { setActiveNav("requests"); navigate("/requests"); }}>Requests</li>
          <li className={activeNav === "myRequests" ? "active" : ""} onClick={() => { setActiveNav("myRequests"); navigate("/my-requests"); }}>My Requests</li>
          <li className={activeNav === "addTask" ? "active" : ""} onClick={() => { setActiveNav("addTask"); navigate("/add-task"); }}>Add Task</li>
          <li className={activeNav === "settings" ? "active" : ""} onClick={() => { setActiveNav("settings"); navigate("/settings"); }}>Settings</li>
        </ul>

        {/* Calendar */}
        <div className="calendar-widget">
          <div className="calendar-header">
            <button onClick={handlePrevMonth}>&lt;</button>
            <span>{monthName} {currentYear}</span>
            <button onClick={handleNextMonth}>&gt;</button>
          </div>
          <div className="calendar-days">
            {["Su","Mo","Tu","We","Th","Fr","Sa"].map((d, i) => <div key={i} className="weekday">{d}</div>)}
            {generateCalendarDays().map((day, i) => (
              <div
                key={i}
                className={`day ${!day.currentMonth ? "inactive" : ""} ${day.selected ? "selected" : ""}`}
                onClick={() => handleDateSelect(day.day, day.currentMonth)}
              >
                {day.day}
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="settings-main">
        <h2>Account</h2>
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

    {/* Hidden file input */}
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
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First name" />
            </div>
            <div>
              <label>Last Name</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last name" />
            </div>
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter your phone number" />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email || ""} onChange={handleChange} placeholder="Enter your email" />
          </div>

          <div className="form-group">
            <label>Date of Birth</label>
            <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">Save Changes</button>
            <button type="button" className="btn-secondary">Cancel</button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default SettingsPage;
