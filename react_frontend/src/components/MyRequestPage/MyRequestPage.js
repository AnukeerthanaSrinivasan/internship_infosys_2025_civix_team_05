import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../ui/button.css';
import './MyRequestPage.css';
import CalendarWidget from '../ui/CalendarWidget';

const STATUS_OPTIONS = ['All', 'pending', 'accepted', 'rejected'];

export default function MyRequestPage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeNav, setActiveNav] = useState('myRequests');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState('table');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef(null);
  const [userEmail, setUserEmail] = useState('');

  // Fetch user's requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/myrequest/myrequesttasks', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const transformedRequests = (res.data || []).map(req => ({
          ...req,
          id: req._id || req.id,
          title: req.title || `Request ${req._id}`,
          description: req.description || 'No description available',
          status: req.status || 'pending'
        }));

        setRequests(transformedRequests);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to load your requests. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  // Get user email
  useEffect(() => {
    const email = localStorage.getItem('email');
    if (email) setUserEmail(email);
  }, []);

  // Close dropdown menu on click outside
  useEffect(() => {
    const handler = e => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Filter requests based on search and status filter
  const filteredRequests = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!Array.isArray(requests)) return [];
    return requests.filter(r => {
      const matchesSearch =
        !q ||
        (r.title && r.title.toLowerCase().includes(q)) ||
        (r.description && r.description.toLowerCase().includes(q)) ||
        (r._id && r._id.toLowerCase().includes(q));
      const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [requests, searchQuery, statusFilter]);

  const handleRefreshRequests = () => window.location.reload();

  // Returns CSS class name based on status
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'accepted': return 'status-accepted';
      case 'rejected': return 'status-rejected';
      default: return 'status-pending';
    }
  };

  // Navigate to task detail page when a task is clicked
  const openTaskDetails = (taskId) => {
    navigate(`/my-request/${taskId}`);
  };

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
              <span>My Requests</span><span className="count2">{requests.length}</span>
            </li>
            <li className={activeNav === 'addTask' ? 'active' : ''} onClick={() => { setActiveNav('addTask'); navigate('/add-task'); }}>
              <span>Add Task</span>
            </li>
            <li className={activeNav === 'settings' ? 'active' : ''} onClick={() => { setActiveNav('settings'); navigate('/settings'); }}>
              <span>Settings</span>
            </li>
          </ul>
        </nav>
        <CalendarWidget storageKey="calendar-widget" />
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="header1">
          <form className="search-bar1" onSubmit={e => e.preventDefault()}>
            <button className="search-icon1" type="submit" aria-label="search">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
            <input
              type="text"
              placeholder="Search requests..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </form>

          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
            >
              Table
            </button>
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              Grid
            </button>
          </div>

          <div className="user-profile" ref={profileRef}>
            <div className="profile-container" onClick={() => setShowProfileMenu(s => !s)}>
              <div className="user-avatar">
                <img src={`https://ui-avatars.com/api/?name=${userEmail[0] || 'U'}&background=6c5ce7&color=fff`} alt="user" />
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
                  }}>Account Settings</li>
                  <li onClick={() => {
                    const confirmLogout = window.confirm("Are you sure you want to logout?");
                    if (confirmLogout) {
                      localStorage.removeItem('token');
                      navigate('/login');
                    }
                  }}>Logout</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="scrollable-content">
          <div className="status-filters-bar">
            <label>Status</label>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {error && (
            <div className="error-box">
              {error}
              <button onClick={handleRefreshRequests}>Retry</button>
            </div>
          )}

          {loading && <div className="loading-msg">Loading your requests...</div>}

          {!loading && !error && filteredRequests.length === 0 && (
            <div className="no-data">
              {searchQuery ? `No requests found matching "${searchQuery}"` : 'No requests found.'}
            </div>
          )}

          {!loading && filteredRequests.length > 0 && (
            viewMode === 'table' ? (
              <div className="table-holder">
                <div className="request-table">
                  <div className="table-head">
                    <div className="col col-id">Task ID</div>
                    <div className="col col-desc">Description</div>
                    <div className="col col-status">Status</div>
                  </div>
                  {filteredRequests.map(req => (
                    <div
                      className="table-row"
                      key={req.id}
                      onClick={() => openTaskDetails(req.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="col col-id">{req.id}</div>
                      <div className="col col-desc">{req.description}</div>
                      <div className={`col col-status ${getStatusClass(req.status)}`}>
                        {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="request-grid">
                {filteredRequests.map(req => (
                  <div
                    className={`request-card ${getStatusClass(req.status)}`}
                    key={req.id}
                    onClick={() => openTaskDetails(req.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <h3>Task ID: {req.id}</h3>
                    <p>{req.description}</p>
                    <span className={`status ${getStatusClass(req.status)}`}>
                      {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
