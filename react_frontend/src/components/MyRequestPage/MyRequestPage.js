import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MyRequestPage.css';
import CalendarWidget from '../ui/CalendarWidget';
import '../ui/header.css';

// ---------------- Badge -----------------
const Badge = ({ variant = 'default', children }) => {
  const slug = String(variant || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '');
  return <span className={`badge ${slug || 'default'}`}>{children}</span>;
};

// ---------------- Filters -----------------
const STATUS_OPTIONS = ['All', 'pending', 'accepted', 'rejected'];


export default function MyRequestPage() {
  const navigate = useNavigate();

  // ---------- Data state ----------
  const [requests, setRequests] = useState([]);       // ✅ will hold an array now
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ---------- UI state ----------
  const [activeNav, setActiveNav] = useState('myRequests');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [viewMode, setViewMode] = useState('table');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth());
  const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());
  const profileRef = useRef(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // ---------- Fetch requests ----------
  useEffect(() => {
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const res = await axios.get('http://localhost:5000/api/myrequest/myrequesttasks', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRequests(res.data || []);   // ✅ backend already sends array with status
    } catch (err) {
      console.error(err);
      setError('Failed to load your requests.');
    } finally {
      setLoading(false);
    }
  };
  fetchRequests();
}, []);


  // ---------- Close profile dropdown ----------
  useEffect(() => {
    const handler = e => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Calendar handled by CalendarWidget (state persisted)
const [userEmail, setUserEmail] = useState('');
useEffect(() => {
  const email = localStorage.getItem('email');
  if (email) setUserEmail(email);
}, []);
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else setCurrentMonth(m => m - 1);
  };
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else setCurrentMonth(m => m + 1);
  };
  const handleDateSelect = dayObj => {
    if (dayObj.cur) setSelectedDate(new Date(currentYear, currentMonth, dayObj.day));
  };

  // ---------- Filtering ----------
  const filteredRequests = useMemo(() => {
  const q = searchQuery.trim().toLowerCase();
  if (!Array.isArray(requests)) return [];

  return requests.filter(r => {
    const matchesSearch =
      !q ||
      r.title?.toLowerCase().includes(q) ||
      r.description?.toLowerCase().includes(q) ||
      r._id?.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
 
  return matchesSearch && matchesStatus;
  });
}, [requests, searchQuery, statusFilter]);


  const monthName = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' });

  if (loading) return <div className="loading">Loading your requests…</div>;
  if (error) return <div className="error">{error}</div>;

  // ---------- UI ----------
  return (
    // ... your existing JSX below remains unchanged ...
    // (no need to modify the big layout—only the fetching logic above is different)
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
            <li className={activeNav === 'settings' ? 'active' : ''} onClick={() => {setActiveNav('settings'); navigate('/settings')}}><span>Settings</span></li>
          </ul>
        </nav>

        {/* Calendar */}
        <CalendarWidget storageKey="calendar-widget" />
      </div>

      {/* Main content */}
      <main className="main-content112">
        {/* Header - Search + Account only */}
        <div className="top-header">
          <form className="header-search" onSubmit={e => e.preventDefault()}>
            <button className="icon-btn" type="submit" aria-label="search">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </form>

          <div className="profile" ref={profileRef}>
            <div className="profile-trigger" onClick={() => setShowProfileMenu(s => !s)}>
              <img className="avatar" src={`https://ui-avatars.com/api/?name=${userEmail[0] || 'U'}&background=6c5ce7&color=fff`} alt="user"/>
              <div className="profile-text">
                <div className="user-info">
                  <div className="user-name">{userEmail.split('@')[0]}</div>
                  <div className="user-email">{userEmail}</div>
                </div>
              </div>
            </div>
            {showProfileMenu && (
              <div className="profile-dropdown">
                <ul>
                  <li onClick={() => { navigate('/settings'); setShowProfileMenu(false); }}>
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

        <div className="content-container">
          {/* Move title/controls below */}
          <header className="page-header">
            <div className="title-block">
              <h1>My Requests</h1>
              <p className="subtitle">Track the requests you have sent.</p>
            </div>
          </header>

          {/* Filters */}
          <div className="secondary-controls">
          <div className="left-controls">
            <div className="filter-group">
              <label>Status</label>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            
          </div>

          <div className="right-controls">
            <div className="view-toggle">
              <button className={`view-btn ${viewMode === 'table' ? 'active' : ''}`} onClick={() => setViewMode('table')}>☰</button>
              <button className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>▦</button>
            </div>
            <button className="add-task-cta" onClick={() => navigate('/add-task')}>+ Add New Request</button>
          </div>
        </div>

        {/* Requests */}
        <section className={`requests-section ${viewMode === 'grid' ? 'grid-view' : 'list-view'}`}>
          {filteredRequests.length === 0 && (
            <div className="empty-state">No requests match your filters.</div>
          )}

          {viewMode === 'grid' && (
            <div className="request-grid">
              {filteredRequests.map(req => (
                <article key={req._id} className="request-card">
                  <div className="card-body">
                    <div className="card-header">
                      <h3 className="card-title">{req.title}</h3>
                      <Badge variant={req.status}>{req.status}</Badge>
                    </div>
                    <p className="card-desc">{req.description}</p>
                    
                    <div className="card-actions">
                      <button onClick={() => navigate(`/requests/${req._id}`)}>View</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {viewMode === 'table' && (
            <div className="request-table">
              <div className="table-head">
                <div className="col col-task">ID</div>
                <div className="col col-title">Title</div>
                <div className="col col-status">Status</div>
                
              </div>
              {filteredRequests.map(req => (
                <div className="table-row" key={req._id}>
                  <div className="col col-task">{req._id}</div>
                  <div className="col col-title">
                    <div className="row-title">{req.title}</div>
                    <div className="row-desc">{req.description}</div>
                  </div>
                  <div className="col col-status"><Badge variant={req.status}>{req.status}</Badge></div>
                  <div className="col col-priority">{req.priority}</div>
                  
                </div>
              ))}
            </div>
          )}
        </section>
        </div>
      </main>
    </div>
  );
}
