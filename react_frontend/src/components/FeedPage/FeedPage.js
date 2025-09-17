import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './FeedPage.css';
import '../ui/button.css';

const FeedPage = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeNav, setActiveNav] = useState('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
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
  const handleRequest = (taskId) => {
    setLoadingRequests(prev => ({ ...prev, [taskId]: true }));
    setTimeout(() => {
      setLoadingRequests(prev => ({ ...prev, [taskId]: false }));
      alert(`Request sent for Task ${taskId}`);
    }, 1000);
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
              <span>Feed</span><span className="count">{tasks.length}</span>
            </li>
            <li className={activeNav === 'myTasks' ? 'active' : ''} onClick={() => { setActiveNav('myTasks'); navigate('/my-tasks'); }}>
              <span>My Tasks</span>
            </li>
            <li className={activeNav === 'requests' ? 'active' : ''} onClick={() => setActiveNav('requests')}><span>Requests</span></li>
            <li className={activeNav === 'myRequests' ? 'active' : ''} onClick={() => setActiveNav('myRequests')}><span>My Requests</span></li>
            <li className={activeNav === 'addTask' ? 'active' : ''} onClick={() => { setActiveNav('addTask'); navigate('/add-task'); }}>
              <span>Add Task</span>
            </li>
            <li className={activeNav === 'settings' ? 'active' : ''} onClick={() => setActiveNav('settings')}><span>Settings</span></li>
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

      {/* Main Content */}
      <div className="main-content">
        {/* Header - Fixed at top */}
        <div className="header">
          <form className="search-bar" onSubmit={handleSearchSubmit}>
            <button type="submit" className="search-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
            <input type="text" placeholder="Search tasks..." value={searchQuery} onChange={handleSearchChange} />
          </form>
          <div className="user-profile" ref={profileRef}>
            <div className="profile-container" onClick={() => setShowProfileMenu(!showProfileMenu)}>
              <div className="user-avatar"><img src="https://ui-avatars.com/api/?name=S&background=6c5ce7&color=fff" alt="User" /></div>
              <div className="user-info">
                <div className="user-name">shadcn</div>
                <div className="user-email">m@example.com</div>
              </div>
            </div>
            {showProfileMenu && (
              <div className="profile-dropdown">
                <ul>
                  <li>My Profile</li>
                  <li>Account Settings</li>
                  <li>Help Center</li>
                  <li onClick={() => {
                    localStorage.removeItem('token');
                    navigate('/login');
                  }}>Logout</li>
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
                      onClick={() => handleRequest(task._id)} 
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
      </div>
    </div>
  );
};

export default FeedPage;