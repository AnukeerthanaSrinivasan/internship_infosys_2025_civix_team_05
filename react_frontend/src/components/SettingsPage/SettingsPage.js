import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./SettingsPage.css";

const SettingsPage = () => {
  const [activeNav, setActiveNav] = useState("settings");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth());
  const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    language: "",
    bio: "",
    urls: "",
  });

  const navigate = useNavigate();
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        // Placeholder for dropdown logic
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const monthName = new Date(currentYear, currentMonth).toLocaleString("default", { month: "long" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="feed-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">Hire A Helper</div>
        <nav className="sidebar-nav">
          <ul>
            <li className={activeNav === "feed" ? "active" : ""} onClick={() => { setActiveNav("feed"); navigate("/feed"); }}>
              <span>Feed</span> <span className="count">128</span>
            </li>
            <li className={activeNav === "myTasks" ? "active" : ""} onClick={() => { setActiveNav("myTasks"); navigate("/my-tasks"); }}>
              <span>My Tasks</span> <span className="count">9</span>
            </li>
            <li className={activeNav === "requests" ? "active" : ""} onClick={() => { setActiveNav("requests"); navigate("/requests"); }}>
              <span>Requests</span>
            </li>
            <li className={activeNav === "myRequests" ? "active" : ""} onClick={() => { setActiveNav("myRequests"); navigate("/my-requests"); }}>
              <span>My Requests</span> <span className="count">23</span>
            </li>
            <li className={activeNav === "settings" ? "active" : ""} onClick={() => { setActiveNav("settings"); navigate("/settings"); }}>
              <span>Settings</span>
            </li>
          </ul>
        </nav>

        {/* Calendar Widget */}
        <div className="calendar-widget">
          <div className="calendar-header">
            <button className="prev-month" onClick={handlePrevMonth}>&lt;</button>
            <div className="current-month">{monthName} {currentYear}</div>
            <button className="next-month" onClick={handleNextMonth}>&gt;</button>
          </div>
          <div className="calendar-days">
            {["Su","Mo","Tu","We","Th","Fr","Sa"].map((d, i) => <div key={i} className="weekday">{d}</div>)}
            {generateCalendarDays().map((day, idx) => (
              <div key={idx} className={`day ${!day.currentMonth ? "prev-month" : ""} ${day.selected ? "selected" : ""}`} 
                   onClick={() => handleDateSelect(day.day, day.currentMonth)}>
                {day.day}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="settings-card">
          <h2 className="form-title">Account</h2>
          <p className="form-subtitle">Update your profile information and preferences.</p>
          <form>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input type="text" name="name" className="form-input" value={formData.name} onChange={handleChange} />
              <small className="form-hint">This is the name that will be displayed on your profile and in emails.</small>
            </div>

            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <input type="date" name="dob" className="form-input" value={formData.dob} onChange={handleChange} />
              <small className="form-hint">Pick a date</small>
            </div>

            <div className="form-group">
              <label className="form-label">Language</label>
              <select name="language" className="form-input" value={formData.language} onChange={handleChange}>
                <option value="">Select language</option>
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
                <option value="spanish">Spanish</option>
              </select>
              <small className="form-hint">Select the language used in your dashboard.</small>
            </div>

            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea name="bio" className="form-input" value={formData.bio} onChange={handleChange} />
              <small className="form-hint">This is the language that will be used in the dashboard.</small>
            </div>

            <div className="form-group">
              <label className="form-label">URLs</label>
              <input type="url" name="urls" className="form-input" value={formData.urls} onChange={handleChange} />
              <small className="form-hint">Add links to your website, blog, or social media profiles.</small>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">Save Changes</button>
              <button type="button" className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
