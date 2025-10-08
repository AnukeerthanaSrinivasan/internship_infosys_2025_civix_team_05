import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TaskDetailsPage.css';

export default function TaskDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/myrequest/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTask(res.data);
      } catch (err) {
        setError('Failed to load task details.');
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  if (loading) return <div className="loading-msg">Loading task details...</div>;
  if (error) return <div className="error-box">{error}</div>;
  if (!task) return <div className="no-data">Task not found.</div>;

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted': return 'status-accepted';
      case 'rejected': return 'status-rejected';
      default: return 'status-pending';
    }
  };

  return (
    <div className="task-details-container">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      <div className={`task-details-card ${getStatusClass(task.status)}`}>
        <h2>Task Details</h2>
        <p><b>Task ID:</b> {task._id}</p>
        <p><b>Title:</b> {task.title}</p>
        <p><b>Description:</b> {task.description}</p>
        <p><b>Status:</b> <span className={`status-badge ${getStatusClass(task.status)}`}>
          {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
        </span></p>
        {task.createdAt && <p><b>Created On:</b> {new Date(task.createdAt).toLocaleString()}</p>}
      </div>
    </div>
  );
}