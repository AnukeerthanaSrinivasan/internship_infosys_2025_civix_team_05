import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./RequestPage.css";

function RequestPage() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("requests");
  const [activeTab, setActiveTab] = useState("all");
  const [requests, setRequests] = useState([]);
const [userEmail, setUserEmail] = useState('');
useEffect(() => {
  const email = localStorage.getItem('email');
  if (email) setUserEmail(email);
}, []);
  // Fetch requests from backend
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

  // Handle Accept
  const handleAccept = async (req) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/myrequest/accept",
        {
          taskId: req.task._id,
          requestId: req._id,        // send the requestId
          description: req.description,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the request's status in UI
      setRequests((prev) =>
        prev.map((r) =>
          r._id === req._id ? { ...r, status: "accepted" } : r
        )
      );
    } catch (err) {
      console.error("Error accepting request:", err);
    }
  };

  // Handle Decline (optional backend later)
  const handleDecline = (id) => {
    setRequests((prev) =>
      prev.map((r) =>
        r._id === id ? { ...r, status: "rejected" } : r
      )
    );
  };

  // Filter requests by tab
  const filteredRequests =
    activeTab === "unread"
      ? requests.filter((r) => r.status === "pending")
      : requests;

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
      </div>

      {/* Main content */}
      <div className="main-content123">
        <br />
        <div className="top-bar123">
          <form className="search-bar123">
            <input type="text" placeholder="Search requests..." />
          </form>
          <div className="tabs">
            <button className={activeTab === "all" ? "active" : ""} onClick={() => setActiveTab("all")}>
              All Req
            </button>
            <button className={activeTab === "unread" ? "active" : ""} onClick={() => setActiveTab("unread")}>
              Pending
            </button>
          </div>
          <div className="user-profile">
            <div className="avatar">S</div>
            <div>
              <div className="user-info">
                <div className="user-name">{userEmail.split('@')[0]}</div>
                <div className="user-email">{userEmail}</div>

              </div>
            </div>
          </div>
        </div>

        <h2 className="section-title">Incoming Requests</h2>

        {/* Request list */}
        <div className="request-list">
          {filteredRequests.length === 0 ? (
            <p>No requests found.</p>
          ) : (
            filteredRequests.map((req) => (
              <div className="request-item" key={req._id}>
                <div className="request-info">
                  <h4>Requester: {req.requester?.name || req.requester}</h4>
                  <div className="request-title">Task: {req.task?.title || req.task}</div>
                  <p className="request-desc">{req.description}</p>
                  <div className="actions">
                    {req.status === "pending" ? (
                      <>
                        <button onClick={() => handleAccept(req)} className="pill accept">
                          Accept
                        </button>
                        <button onClick={() => handleDecline(req._id)} className="pill decline">
                          Decline
                        </button>
                      </>
                    ) : (
                      <span className={`pill status ${req.status === "accepted" ? "accept-badge" : "decline-badge"}`}>
                        {req.status}
                      </span>
                    )}
                  </div>
                </div>
                <div className="request-time">
                  {new Date(req.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default RequestPage;
