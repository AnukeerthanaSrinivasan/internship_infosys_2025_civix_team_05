import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyTaskPage.css';
import { Badge } from '../ui/button';
import '../ui/button.css';

const MyTaskPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeNav, setActiveNav] = useState('myTasks');
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [myTasks, setMyTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const [userEmail, setUserEmail] = useState('');

  const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth());
  const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());

  useEffect(() => {
    const email = localStorage.getItem('email');
    if (email) setUserEmail(email);
  }, []);

  // Fetch tasks
  useEffect(() => {
    const fetchMyTasks = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/feed/mytasks', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const tasks = await response.json();

        const getTaskImage = (task, index) => {
          if (task.image || task.picture) return task.image || task.picture;
          const defaultImages = [
            'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', // Moving
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', // Cleaning
            'https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', // Handyman
            'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', // Gardening
            'https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', // Cooking
            'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', // Shopping
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'  // General
          ];
          const content = (task.title + ' ' + task.description).toLowerCase();
          if (content.includes('mov') || content.includes('pack')) return defaultImages[0];
          if (content.includes('clean')) return defaultImages[1];
          if (content.includes('fix') || content.includes('repair')) return defaultImages[2];
          if (content.includes('garden')) return defaultImages[3];
          if (content.includes('cook') || content.includes('meal')) return defaultImages[4];
          if (content.includes('shop')) return defaultImages[5];
          return defaultImages[index % defaultImages.length];
        };

        const transformedTasks = tasks.map((task, index) => ({
          id: task._id || task.id,
          title: task.title || `Task ${task._id}`,
          description: task.description || 'No description available',
          location: task.location || 'Location not specified',
          startDate: task.startDate ? new Date(task.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Date not set',
          endDate: task.endTime || task.endDate ? (task.endTime || new Date(task.endDate).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })) : '6:00 PM',
          image: getTaskImage(task, index),
          status: task.status || 'Active'
        }));
        setMyTasks(transformedTasks);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to load tasks. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyTasks();
  }, []);

  // Profile dropdown click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileRef]);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleSearchSubmit = (e) => { e.preventDefault(); alert(`Searching for: ${searchQuery}`); };

  const filteredTasks = myTasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calendar functionality
  const monthName = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' });
  const generateCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
    const days = [];
    for (let i = firstDay - 1; i >= 0; i--) days.push({ day: daysInPrevMonth - i, currentMonth: false, selected: false });
    for (let i = 1; i <= daysInMonth; i++) days.push({ day: i, currentMonth: true, selected: i === selectedDate.getDate() && currentMonth === selectedDate.getMonth() && currentYear === selectedDate.getFullYear() });
    for (let i = 1; days.length < 42; i++) days.push({ day: i, currentMonth: false, selected: false });
    return days;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(prev => prev === 0 ? (setCurrentYear(prevYear => prevYear - 1), 11) : prev - 1);
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => prev === 11 ? (setCurrentYear(prevYear => prevYear + 1), 0) : prev + 1);
  };

  const handleDateSelect = (day, isCurrentMonth) => { if (isCurrentMonth) setSelectedDate(new Date(currentYear, currentMonth, day)); };

  const handleRefreshTasks = () => window.location.reload();

  return (
    <div className="feed-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">Hire A Helper</div>
        <nav className="sidebar-nav">
          <ul>
            <li className={activeNav === 'feed' ? 'active' : ''} onClick={() => {setActiveNav('feed'); navigate('/feed');}}><span>Feed</span></li>
            <li className={activeNav === 'myTasks' ? 'active' : ''} onClick={() => setActiveNav('myTasks')}><span>My Tasks</span><span className="count2">{myTasks.length}</span></li>
            <li className={activeNav === 'requests' ? 'active' : ''} onClick={() => {setActiveNav('requests'); navigate('/request');}}><span>Requests</span></li>
            <li className={activeNav === 'myRequests' ? 'active' : ''} onClick={() => {setActiveNav('myRequests'); navigate('/my-request');}}><span>My Requests</span></li>
            <li className={activeNav === 'add-task' ? 'active' : ''} onClick={() => {setActiveNav('add-task'); navigate('/add-task');}}><span>Add Task</span></li>
            <li className={activeNav === 'settings' ? 'active' : ''} onClick={() => {setActiveNav('settings'); navigate('/settings')}}><span>Settings</span></li>
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
            {['Su','Mo','Tu','We','Th','Fr','Sa'].map((d,i) => <div key={i} className="weekday">{d}</div>)}
            {generateCalendarDays().map((day,i) => (
              <div key={i} className={`day ${!day.currentMonth?'prev-month':''} ${day.selected?'selected':''}`} onClick={()=>handleDateSelect(day.day, day.currentMonth)}>{day.day}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="header1">
          <form className="search-bar2" onSubmit={handleSearchSubmit}>
            <button type="submit" className="search-icon2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
            <input type="text" placeholder="Search tasks..." value={searchQuery} onChange={handleSearchChange}/>
          </form>
          <div className="user-profile" ref={profileRef}>
            <div className="profile-container" onClick={()=>setShowProfileMenu(!showProfileMenu)}>
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
                  <li onClick={() => { if(window.confirm("Are you sure you want to logout?")) { localStorage.removeItem('token'); navigate('/login'); } }}>Logout</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="scrollable-content">
          <div className="add-task-button-container">
            <button className="add-task-button" onClick={()=>{setActiveNav('add-task'); navigate('/add-task');}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg> Add New Task
            </button>
          </div>

          {error && <div style={{padding:'12px', background:'#fee', color:'#c33', borderRadius:'6px', margin:'16px 0', border:'1px solid #fcc'}}>{error}<button onClick={handleRefreshTasks} style={{marginLeft:'12px', padding:'4px 8px', background:'#c33', color:'#fff', border:'none', borderRadius:'4px', cursor:'pointer'}}>Retry</button></div>}
          {loading && <div style={{padding:'40px', textAlign:'center', color:'#666'}}>Loading your tasks...</div>}
          {!loading && !error && filteredTasks.length===0 && <div style={{padding:'40px', textAlign:'center', color:'#666'}}>{searchQuery?`No tasks found matching "${searchQuery}"`:'No tasks found. Create your first task!'}</div>}
          {!loading && filteredTasks.length>0 && (
            <div className="task-grid">
              {filteredTasks.map(task=>(
                <div className="task-card" key={task.id}>
                  <div className="task-image"><img src={task.image} alt={task.title}/></div>
                  <h3 className="task-title">{task.title}</h3>
                  <p className="task-description">{task.description}</p>
                  <div className="task-details">
                    <p className="task-location">
                      <i className="location-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></i> {task.location}
                    </p>
                    <p className="task-dates">
                      <i className="calendar-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></i>
                      <span>{task.startDate} • 2:00 PM - {task.endDate}</span>
                    </p>
                  </div>
                  <div className="task-status-container"><Badge variant={task.status.toLowerCase().replace(' ','-')}>{task.status}</Badge></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTaskPage;
