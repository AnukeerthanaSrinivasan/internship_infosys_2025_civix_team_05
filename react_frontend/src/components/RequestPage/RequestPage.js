import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaBell } from "react-icons/fa"; 
import "./RequestPage.css";

function RequestPage() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("requests");
  const [activeTab, setActiveTab] = useState("all");
  const [requests, setRequests] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Calendar state
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth());
  const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());

  // Get user email
  useEffect(() => {
    const email = localStorage.getItem('email');
    if (email) setUserEmail(email);
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

  // Fetch notifications every 5s
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

  const handleDecline = (id) => {
    setRequests(prev =>
      prev.map(r => r._id === id ? { ...r, status: "rejected" } : r)
    );
  };

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

  // Calendar functions
  const handlePrevMonth = () => {
    setCurrentMonth(prev => {
      if (prev === 0) {
        setCurrentYear(y => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => {
      if (prev === 11) {
        setCurrentYear(y => y + 1);
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
    }
  };

  const monthName = new Date(currentYear, currentMonth).toLocaleString("default", { month: "long" });

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
            <li className={activeNav === 'feed' ? 'active' : ''} onClick={() => { setActiveNav('feed'); navigate('/feed'); }}>Feed</li>
            <li className={activeNav === 'myTasks' ? 'active' : ''} onClick={() => { setActiveNav('myTasks'); navigate('/my-tasks'); }}>My Tasks</li>
            <li className={activeNav === 'requests' ? 'active' : ''} onClick={() => { setActiveNav('requests'); navigate('/request'); }}>Requests</li>
            <li className={activeNav === 'myRequests' ? 'active' : ''} onClick={() => { setActiveNav('myRequests'); navigate('/my-request'); }}>My Requests</li>
            <li className={activeNav === 'addTask' ? 'active' : ''} onClick={() => { setActiveNav('addTask'); navigate('/add-task'); }}>Add Task</li>
            <li className={activeNav === 'settings' ? 'active' : ''} onClick={() => {setActiveNav('settings'); navigate('/settings')}}><span>Settings</span></li>
          </ul>
        </nav>

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
      </div>

      {/* Main content */}
      <div className="main-content123">
        {/* Top bar, notifications, user info, tabs (same as your current code) */}
        {/* Request list (same as your current code) */}
      </div>
    </div>
  );
}

export default RequestPage;
