import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { FaBell } from "react-icons/fa"; 
import CalendarWidget from '../ui/CalendarWidget';
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
  const [searchQuery, setSearchQuery] = useState('');
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
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  // Accept request
  const handleAccept = async (reqItem) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/myrequest/accept",
        {
          taskId: reqItem.task,
          requester: reqItem.requester._id || reqItem.requester,
          description: reqItem.description
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests(prev =>
        prev.map(r =>
          r._id === reqItem._id ? { ...r, status: "accepted" } : r
        )
      );
    } catch (err) {
      console.error("Error accepting request:", err.response?.data || err.message);
    }
  };

  // Reject request
  const handleReject = async (reqItem) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/myrequest/reject",
        {
          taskId: reqItem.task,
          requester: reqItem.requester._id || reqItem.requester,
          description: reqItem.description
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests(prev =>
        prev.map(r => r._id === reqItem._id ? { ...r, status: "rejected" } : r)
      );
    } catch (err) {
      console.error("Error rejecting request:", err.response?.data || err.message);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/api/notification/update",
        { notificationId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(prev =>
        prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  // Handle search
  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleSearchSubmit = (e) => { e.preventDefault(); /* implement actual search filter if needed */ };

  // Filter requests based on tab and search
  const filteredRequests = (activeTab === "unread" 
    ? requests.filter(r => r.status === "pending")
    : requests
  ).filter(r =>
    (r.task?.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <CalendarWidget storageKey="calendar-widget" />
      </div>

      {/* Main content */}
      <div className="main-content">
        {/* Header/search+profile consistency with My Tasks */}
        <div className="header1">
          <form className="search-bar1" onSubmit={handleSearchSubmit}>
            <button type="submit" className="search-icon1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
            <input
              type="text"
              placeholder="Search requests..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
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
                    .filter(n => !n.isRead)
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

          <div className="user-profile" ref={profileRef}>
            <div className="profile-container" onClick={() => setShowProfileMenu(!showProfileMenu)}>
              <div className="user-avatar">
                <img src={`https://ui-avatars.com/api/?name=${userEmail[0] || 'U'}&background=6c5ce7&color=fff`} alt="User" />
              </div>
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
                    setShowProfileMenu(false);
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

        <div className="scrollable-content">
          <h2 className="section-title">Incoming Requests</h2>
          <div className="request-list">
            {filteredRequests.length === 0 ? (
              <p>No requests found.</p>
            ) : (
              filteredRequests.map((req) => (
                <div className="request-item" key={req._id}>
                  <div className="request-info">
                    <h4>Requester: {req.requester?.firstName}</h4>
                    <div className="request-title">Task: {req.task?.title || req.task}</div>
                    <p className="request-desc">{req.description}</p>
                    <div className="actions">
                      {req.status === "pending" ? (
                        <>
                          <button onClick={() => handleAccept(req)} className="pill accept">Accept</button>
                          <button onClick={() => handleReject(req)} className="pill decline">Decline</button>
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
    </div>
  );
}

export default RequestPage;
