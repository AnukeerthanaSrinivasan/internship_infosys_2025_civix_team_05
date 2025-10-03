import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { FaBell } from "react-icons/fa"; 
import "./RequestPage.css";

function RequestPage() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("requests");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("all");
  const [requests, setRequests] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [notifications, setNotifications] = useState([]); 
  const [showDropdown, setShowDropdown] = useState(false);

  // Get user email
  useEffect(() => {
    const email = localStorage.getItem('email');
    if (email) setUserEmail(email);
  }, []);

  
    const profileRef = useRef(null);
  
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
  // Fetch requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/requests/requests", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(res.data);
      } catch (err) {
        console.error("Error fetching requests:", err);
      }
    };
    fetchRequests();
  }, []);

  // Fetch notifications initially and every 5 seconds
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/notification/get", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(res.data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000); // poll every 5s
    return () => clearInterval(interval);
  }, []);

  // Toggle notification dropdown
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  // Accept request
  const handleAccept = async (req) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/myrequest/accept",
        {
          taskId: req.task._id,
          requestId: req._id,
          description: req.description,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRequests(prev =>
        prev.map(r => r._id === req._id ? { ...r, status: "accepted" } : r)
      );
    } catch (err) {
      console.error("Error accepting request:", err);
    }
  };
  // Calendar logic
    const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth());
    const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());
    const monthName = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' });
  
    const generateCalendarDays = () => {
      const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
      const days = [];
  
      for (let i = firstDayOfMonth - 1; i >= 0; i--) days.push({ day: daysInPrevMonth - i, currentMonth: false, selected: false });
      for (let i = 1; i <= daysInMonth; i++) days.push({ day: i, currentMonth: true, selected: i === selectedDate.getDate() && currentMonth === selectedDate.getMonth() && currentYear === selectedDate.getFullYear() });
      for (let i = 1; i <= 42 - days.length; i++) days.push({ day: i, currentMonth: false, selected: false });
  
      return days;
    };
  
    const handlePrevMonth = () => setCurrentMonth(prev => prev === 0 ? (setCurrentYear(y => y - 1), 11) : prev - 1);
    const handleNextMonth = () => setCurrentMonth(prev => prev === 11 ? (setCurrentYear(y => y + 1), 0) : prev + 1);
    const handleDateSelect = (day, isCurrentMonth) => { if (isCurrentMonth) setSelectedDate(new Date(currentYear, currentMonth, day)); };
  
    // Format date and time
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    };
  
    const formatTime = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    };
  
// Mark notification as read
const markAsRead = async (notificationId) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.put(
      "http://localhost:5000/api/notification/update",
      { notificationId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Update local state
    setNotifications(prev =>
      prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
    );
  } catch (err) {
    console.error("Error marking notification as read:", err);
  }
};

  // Decline request
  const handleDecline = (id) => {
    setRequests(prev =>
      prev.map(r => r._id === id ? { ...r, status: "rejected" } : r)
    );
  };

  // Filter requests
  const filteredRequests = activeTab === "unread"
    ? requests.filter(r => r.status === "pending")
    : requests;

  return (
    <div className="request-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">Hire A Helper</div>
        <nav className="sidebar-nav">
          <ul>
            <li className={activeNav === 'feed' ? 'active' : ''} onClick={() => { setActiveNav('feed'); navigate('/feed'); }}>
              <span>Feed</span>
            </li>
            <li className={activeNav === 'myTasks' ? 'active' : ''} onClick={() => { setActiveNav('myTasks'); navigate('/my-tasks'); }}>
              <span>My Tasks</span>
            </li>
            <li className={activeNav === 'requests' ? 'active' : ''} onClick={() => { setActiveNav('requests'); navigate('/request'); }}>
              <span>Requests</span>
            </li>
            <li className={activeNav === 'myRequests' ? 'active' : ''} onClick={() => { setActiveNav('myRequests'); navigate('/my-request'); }}>
              <span>My Requests</span>
            </li>
            <li className={activeNav === 'addTask' ? 'active' : ''} onClick={() => { setActiveNav('addTask'); navigate('/add-task'); }}>
              <span>Add Task</span>
            </li>
            <li className={activeNav === 'settings' ? 'active' : ''} onClick={() => setActiveNav('settings')}>
              <span>Settings</span>
            </li>
          </ul>
        </nav>
        {/* Calendar */}
        <div className="calendar-widget">
          <div className="calendar-header">
            <button className="prev-month" onClick={handlePrevMonth}>&lt;</button>
            <div className="current-month">{monthName} {currentYear}</div>
            <button className="next-month" onClick={handleNextMonth}>&gt;</button>
          </div>
          <div className="calendar-days">
            {['Su','Mo','Tu','We','Th','Fr','Sa'].map((d, i) => <div key={i} className="weekday">{d}</div>)}
            {generateCalendarDays().map((day, index) => (
              <div key={index} className={`day ${!day.currentMonth ? 'prev-month' : ''} ${day.selected ? 'selected' : ''}`} onClick={() => handleDateSelect(day.day, day.currentMonth)}>{day.day}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="main-content123">
        <div className="top-bar123">
          <form className="search-bar123">
            <input type="text" placeholder="Search requests..." />
          </form>

          <div className="tabs">
            <button className={activeTab === "all" ? "active" : ""} onClick={() => setActiveTab("all")}>All Req</button>
            <button className={activeTab === "unread" ? "active" : ""} onClick={() => setActiveTab("unread")}>Pending</button>
          </div>

          {/* Notification bell */}
          <div className="notification-container">
            <FaBell className="notification-icon" onClick={toggleDropdown} />
            {notifications.filter(n => !n.isRead).length > 0 && (
              <span className="badge">{notifications.filter(n => !n.isRead).length}</span>
            )}
            {showDropdown && (
  <div className="notification-dropdown">
    {notifications.filter(n => !n.isRead).length === 0 ? (
      <p>No notifications</p>
    ) : (
      notifications
        .filter(n => !n.isRead) // only show unread
        .map(n => (
          <div key={n._id} className="notification-item unread">
            <div>{n.message}</div>
            <button 
              className="mark-read-btn"
              onClick={() => markAsRead(n._id)}
            >
              Mark as Read
            </button>
          </div>
        ))
    )}
  </div>
)}


          </div>

          {/* User info */}
          <div className="user-profile" ref={profileRef}>
            <div className="profile-container" onClick={() => setShowProfileMenu(!showProfileMenu)}>
              <div className="user-avatar"><img src="https://ui-avatars.com/api/?name=S&background=6c5ce7&color=fff" alt="User" /></div>
              <div className="user-info">
                <div className="user-name">{userEmail.split('@')[0]}</div>
                <div className="user-email">{userEmail}</div>

              </div>
            </div>
            {showProfileMenu && (
              <div className="profile-dropdown">
                <ul>
                  
                  <li onClick={() => {
        navigate('/settings');
        setShowProfileMenu(false); // close dropdown after navigation
      }}>
        Account Settings
      </li>
                  
                  <li onClick={() => {
  const confirmLogout = window.confirm("Are you sure you want to logout?");
  if (confirmLogout) {
    localStorage.removeItem('token');
    navigate('/login');
  }
}}>
  Logout
</li>

                </ul>
              </div>
            )}
          </div>
        </div>

        <h2 className="section-title">Incoming Requests</h2>

        {/* Request list */}
        <div className="request-list">
          {filteredRequests.length === 0 ? (
            <p>No requests found.</p>
          ) : (
            filteredRequests.map((req) => (
              <div className="request-item" key={req._id}>
                <div className="request-info">
                  <h4>Requester: {req.requester?.name || req.requester}</h4>
                  <div className="request-title">Task: {req.task?.title || req.task}</div>
                  <p className="request-desc">{req.description}</p>
                  <div className="actions">
                    {req.status === "pending" ? (
                      <>
                        <button onClick={() => handleAccept(req)} className="pill accept">Accept</button>
                        <button onClick={() => handleDecline(req._id)} className="pill decline">Decline</button>
                      </>
                    ) : (
                      <span className={`pill status ${req.status === "accepted" ? "accept-badge" : "decline-badge"}`}>
                        {req.status}
                      </span>
                    )}
                  </div>
                </div>
                <div className="request-time">{new Date(req.createdAt).toLocaleString()}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default RequestPage;
