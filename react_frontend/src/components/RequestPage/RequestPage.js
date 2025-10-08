import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
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

  // Fetch notifications
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

  // Accept/Reject
  const handleAccept = async (reqItem) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/myrequest/accept",
        { taskId: reqItem.task, requester: reqItem.requester._id || reqItem.requester, description: reqItem.description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests(prev => prev.map(r => r._id === reqItem._id ? { ...r, status: "accepted" } : r));
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (reqItem) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/myrequest/reject",
        { taskId: reqItem.task, requester: reqItem.requester._id || reqItem.requester, description: reqItem.description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests(prev => prev.map(r => r._id === reqItem._id ? { ...r, status: "rejected" } : r));
    } catch (err) {
      console.error(err);
    }
  };

  // Search
  const handleSearchChange = (e) => setSearchQuery(e.target.value);

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
            {["feed","myTasks","requests","myRequests","addTask","settings"].map((nav) => (
              <li
                key={nav}
                className={activeNav === nav ? "active" : ""}
                onClick={() => {
                  setActiveNav(nav);
                  navigate(nav === "feed" ? "/feed" : nav === "myTasks" ? "/my-tasks" : nav === "requests" ? "/request" : nav === "myRequests" ? "/my-request" : nav === "addTask" ? "/add-task" : "/settings");
                }}
              >
                <span>{nav === "myTasks" ? "My Tasks" : nav === "myRequests" ? "My Requests" : nav === "addTask" ? "Add Task" : nav.charAt(0).toUpperCase() + nav.slice(1)}</span>
              </li>
            ))}
          </ul>
        </nav>
        <CalendarWidget storageKey="calendar-widget" />
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="header1">
          <div className="search-bar123">
            <input type="text" placeholder="Search requests..." value={searchQuery} onChange={handleSearchChange} />
          </div>

          <div className="user-profile" ref={profileRef}>
            <div className="profile-container" onClick={() => setShowProfileMenu(!showProfileMenu)}>
              <div className="user-avatar"><img src={`https://ui-avatars.com/api/?name=${userEmail[0] || 'U'}&background=6c5ce7&color=fff`} alt="User" /></div>
              <div className="user-info">
                <div className="user-name">{userEmail.split('@')[0]}</div>
                <div className="user-email">{userEmail}</div>
              </div>
            </div>
            {showProfileMenu && (
              <div className="profile-dropdown">
                <ul>
                  <li onClick={() => { navigate('/settings'); setShowProfileMenu(false); }}>Account Settings</li>
                  <li onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}>Logout</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="scrollable-content">
          <div className="tabs">
            <button className={activeTab === "all" ? "active" : ""} onClick={() => setActiveTab("all")}>All Requests</button>
            <button className={activeTab === "unread" ? "active" : ""} onClick={() => setActiveTab("unread")}>Unread</button>
          </div>

          <div className="request-list">
            {filteredRequests.length === 0 ? <p>No requests found.</p> :
              filteredRequests.map(req => (
                <div className="request-item" key={req._id}>
                  <div className="request-info">
                    <h4>Requester: {req.requester?.firstName}</h4>
                    <div className="request-title">Task: {req.task?.title || req.task}</div>
                    <p className="request-desc">{req.description}</p>
                    <div className="actions">
                      {req.status === "pending" ? (
                        <>
                          <button className="pill accept" onClick={() => handleAccept(req)}>Accept</button>
                          <button className="pill decline" onClick={() => handleReject(req)}>Decline</button>
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
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestPage;
