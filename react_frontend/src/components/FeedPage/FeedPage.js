import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './FeedPage.css';
import '../ui/button.css';
import CalendarWidget from '../ui/CalendarWidget';
import '../ui/header.css';

const FeedPage = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeNav, setActiveNav] = useState('feed');
  const [userRequests, setUserRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
const [selectedTaskForRequest, setSelectedTaskForRequest] = useState(null);
const [requestDescription, setRequestDescription] = useState('');

  const navigate = useNavigate();
  const profileRef = useRef(null);

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
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


  useEffect(() => {
  const fetchUserRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get("http://localhost:5000/api/requests/myrequesttasks", {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Store requests with taskId + status
      const requestsMap = {};
      res.data.forEach(req => {
        requestsMap[req.task] = req.status; // map taskId -> status
      });
      setUserRequests(requestsMap);
    } catch (err) {
      console.error("Error fetching user requests", err);
    }
  };

  fetchUserRequests();
}, []);

  // Fetch tasks from backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/feed', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTasks(res.data);
        // If a task was just added, optimistically prepend if not present
        try {
          const last = JSON.parse(localStorage.getItem('lastAddedTask') || 'null');
          const ts = localStorage.getItem('lastAddedTaskAt');
          if (last && (!res.data || !res.data.find(t => t._id === (last._id || last.id)))) {
            setTasks(prev => [last, ...prev]);
          }
          if (ts && Date.now() - Number(ts) > 60000) {
            localStorage.removeItem('lastAddedTask');
            localStorage.removeItem('lastAddedTaskAt');
          }
        } catch (_) {}
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to load tasks');
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // Request button
  const [userEmail, setUserEmail] = useState('');
  useEffect(() => {
  const email = localStorage.getItem('email');
  if (email) setUserEmail(email);
  }, []);
  // Replace the old handleRequest with this
const handleRequest = async (taskId, taskDescription, taskOwnerId, taskTitle) => {
  try {
    setLoadingRequests(prev => ({ ...prev, [taskId]: true }));

    const token = localStorage.getItem('token');
    if (!token) throw new Error('User not logged in');

    const response = await axios.post(
      'http://localhost:5000/api/requests/addrequest',
      {
        taskId: taskId, // must match backend field
        description: taskDescription  
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json' // explicitly set
        }
      }
   
    );
    const notification=await axios.post(
      'http://localhost:5000/api/notification/add',
      {
        userId: taskOwnerId, // ID of the task owner
        message: `${userEmail} has requested your task "${taskTitle}"`
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    alert(`Request sent successfully for Task ${taskId}`);
    console.log("Notification sent");
    console.log(notification.data);
    console.log(response.data);
  } catch (err) {
    if (err.response?.status === 400 && err.response?.data?.error) {
      alert(err.response.data.error); // 👉 "Request already exists..."
    } else {
      alert("Failed to send request");
    }
    console.error(err.response?.data || err.message);
  } finally {
    setLoadingRequests(prev => ({ ...prev, [taskId]: false }));
  }
};

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Filter tasks based on search
    const filteredTasks = tasks.filter(task => 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setTasks(filteredTasks);
  };

  // Calendar handled by CalendarWidget (state persisted)

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

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="feed-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">Hire A Helper</div>
        <nav className="sidebar-nav">
          <ul>
            <li className={activeNav === 'feed' ? 'active' : ''} onClick={() => setActiveNav('feed')}>
              <span>Feed</span><span className="count1">{tasks.length}</span>
            </li>
            <li className={activeNav === 'myTasks' ? 'active' : ''} onClick={() => { setActiveNav('myTasks'); navigate('/my-tasks'); }}>
              <span>My Tasks</span>
            </li>
            <li className={activeNav === 'requests' ? 'active' : ''} onClick={() => {setActiveNav('requests'); navigate('/request'); }}><span>Requests</span></li>
            <li className={activeNav === 'myRequests' ? 'active' : ''} onClick={() => {setActiveNav('myRequests'); navigate('/my-request');}}><span>My Requests</span></li>
            <li className={activeNav === 'addTask' ? 'active' : ''} onClick={() => { setActiveNav('addTask'); navigate('/add-task'); }}>
              <span>Add Task</span>
            </li>
            <li className={activeNav === 'settings' ? 'active' : ''} onClick={() => {setActiveNav('settings'); navigate('/settings')}}><span>Settings</span></li>
          </ul>
        </nav>

        {/* Calendar */}
        <CalendarWidget storageKey="calendar-widget" />
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header - Search + Account only */}
        <div className="top-header">
          <form className="header-search" onSubmit={handleSearchSubmit}>
            <button type="submit">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
            <input type="text" placeholder="Search products..." value={searchQuery} onChange={handleSearchChange} />
          </form>
          <div className="user-profile" ref={profileRef}>
            <div className="notification-container">
              <button className="notification-btn" onClick={() => navigate('/request')} title="View Notifications" style={{ border: 'none', background: 'none', padding: '8px', cursor: 'pointer' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
                </svg>
                <span className="notification-badge">0</span>
              </button>
            </div>
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

        {/* Task Grid - Below header */}
        <div className="task-grid-container">
          <div className="task-grid">
            {tasks.length > 0 ? (
              tasks.map(task => (
                <div className="task-card" key={task._id}>
                  <div className="task-image">
                    <img src={task.picture || 'https://via.placeholder.com/400x200?text=No+Image'} alt={task.title} />
                  </div>
                  <div className="task-content">
                    <h3 className="task-title">{task.title}</h3>
                    <p className="task-description">{task.description}</p>
                    <div className="task-details">
                      <p className="task-location">
                        <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        {task.location}
                      </p>
                      <p className="task-dates">
                        <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        {formatDate(task.startTime)} • {formatTime(task.startTime)} - {formatTime(task.endTime)}
                      </p>
                    </div>
                    
                 
                  <button 
                      className="request-button" 
                      onClick={() => handleRequest(task._id,task.description,task.userId, task.title)} 
                      disabled={loadingRequests[task._id]}
                    >
                      {loadingRequests[task._id] ? 'Sending...' : 'Request'}
                    </button>

                  </div>
                </div>
              ))
            ) : (
              <div className="no-tasks">No tasks available</div>
            )}
          </div>
        </div>
        {showRequestModal && selectedTaskForRequest && (
  <div className="modal-overlay">
    <div className="modal">
      <h3>Request Task: {selectedTaskForRequest.title}</h3>
      <textarea
        value={requestDescription}
        onChange={(e) => setRequestDescription(e.target.value)}
        placeholder="Enter a description for your request"
        rows={4}
        style={{ width: '100%' }}
      ></textarea>
      <div className="modal-buttons">
        <button
          onClick={() => {
            handleRequest(
              selectedTaskForRequest._id,
              requestDescription,
              selectedTaskForRequest.userId,
              selectedTaskForRequest.title
            );
            setShowRequestModal(false);
          }}
          className="submit-button"
        >
          Submit
        </button>
        <button onClick={() => setShowRequestModal(false)} className="cancel-button">
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

      </div>
    </div>
  );
};

export default FeedPage;