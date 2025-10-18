import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddTaskPage.css';
import '../ui/button.css';
import CalendarWidget from '../ui/CalendarWidget';
import { Home, ClipboardList, MailOpen, Mail, Plus, Settings } from 'lucide-react';

const AddTaskPage = () => {
  const navigate = useNavigate();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); // JWT token
      const res = await fetch('http://localhost:5000/api/feed/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          location,
          startTime: startDate,
          endTime: endDate,
          category,
          picture: imageUrl,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        try {
          localStorage.setItem('lastAddedTask', JSON.stringify(data));
          localStorage.setItem('lastAddedTaskAt', String(Date.now()));
        } catch (e) {}
        alert('Task added successfully!');
        navigate('/feed'); // Redirect to feed page
      } else {
        alert('Error adding task: ' + data.message || JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
      alert('Server error. Please try again.');
    }
  };

  return (
    <div className="feed-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">Hire A Helper</div>
        <nav className="sidebar-nav">
          <ul>
            <li onClick={() => navigate('/feed')}>
              <div className="nav-item">
                <Home className="nav-icon" />
                <span>Feed</span>
              </div>
            </li>
            <li onClick={() => navigate('/my-tasks')}>
              <div className="nav-item">
                <ClipboardList className="nav-icon" />
                <span>My Tasks</span>
              </div>
            </li>
            <li onClick={() => navigate('/request')}>
              <div className="nav-item">
                <MailOpen className="nav-icon request-icon" />
                <span>Requests</span>
              </div>
            </li>
            <li onClick={() => navigate('/my-request')}>
              <div className="nav-item">
                <Mail className="nav-icon my-request-icon" />
                <span>My Requests</span>
              </div>
            </li>
            <li className="active">
              <div className="nav-item">
                <Plus className="nav-icon" />
                <span>Add Task</span>
              </div>
            </li>
            <li onClick={() => navigate('/settings')}>
              <div className="nav-item">
                <Settings className="nav-icon" />
                <span>Settings</span>
              </div>
            </li>
          </ul>
        </nav>
        <CalendarWidget storageKey="calendar-widget" />
      </div>

      {/* Main Content */}
      <div className="main-content1">
  <div className="task-card1">
    <h1 className="page-title" style={{textAlign: 'center'}}>Add New Task</h1>
    <p className="task-subtitle">Create a task and find someone to help you</p>

    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Task Title</label>
        <input
          type="text"
          placeholder="e.g., Help moving furniture"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          placeholder="Describe what help you need, any requirements and what you'll provide"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
      </div>

      <div className="form-group">
        <label>Location</label>
        <input
          type="text"
          placeholder="e.g., 123 Main St, Downtown Road, 13th block, Chennai or specific address"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select a category</option>
          <option>Moving & Delivery</option>
          <option>Cleaning</option>
          <option>Handyman</option>
          <option>Gardening</option>
          <option>Other</option>
        </select>
      </div>

      <div className="form-group">
        <label>Task Image URL</label>
        <input
          type="url"
          placeholder="Paste image link (optional)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </div>

      <button type="submit" className="btn-submit">Post Task</button>
    </form>
  </div>
</div>

    </div>
  );
};

export default AddTaskPage;