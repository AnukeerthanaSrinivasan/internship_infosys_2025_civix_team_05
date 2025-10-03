import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./RequestPage.css";

const Badge = ({ variant = "default", children }) => {
  const slug = String(variant || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");
  return <span className={`badge ${slug || "default"}`}>{children}</span>;
};

const STATUS_OPTIONS = ["All", "pending", "accepted", "declined"];

export default function RequestPage() {
  const navigate = useNavigate();
  const profileRef = useRef(null);

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeNav, setActiveNav] = useState("requests");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const [userEmail, setUserEmail] = useState("");
  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) setUserEmail(email);
  }, []);

  // Close profile dropdown
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Fetch requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token missing. Please login.");

        const res = await axios.get("http://localhost:5000/api/request/all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.data.requests) throw new Error("No requests found.");
        setRequests(res.data.requests);
      } catch (err) {
        console.error(err);
        setError("Failed to load requests. Check your backend URL and token.");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const filteredRequests = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!Array.isArray(requests)) return [];

    return requests.filter((r) => {
      const matchesSearch =
        !q ||
        r.title?.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q) ||
        r._id?.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "All" || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [requests, searchQuery, statusFilter]);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      navigate("/login");
    }
  };

  if (loading) return <div className="loading">Loading requests…</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="request-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">Hire A Helper</div>
        <nav className="sidebar-nav">
          <ul>
            <li
              className={activeNav === "feed" ? "active" : ""}
              onClick={() => {
                setActiveNav("feed");
                navigate("/feed");
              }}
            >
              Feed
            </li>
            <li
              className={activeNav === "myTasks" ? "active" : ""}
              onClick={() => {
                setActiveNav("myTasks");
                navigate("/my-tasks");
              }}
            >
              My Tasks
            </li>
            <li
              className={activeNav === "requests" ? "active" : ""}
              onClick={() => {
                setActiveNav("requests");
                navigate("/request");
              }}
            >
              Requests <span className="count">{requests.length}</span>
            </li>
            <li
              className={activeNav === "myRequests" ? "active" : ""}
              onClick={() => {
                setActiveNav("myRequests");
                navigate("/my-request");
              }}
            >
              My Requests
            </li>
            <li
              className={activeNav === "addTask" ? "active" : ""}
              onClick={() => {
                setActiveNav("addTask");
                navigate("/add-task");
              }}
            >
              Add Task
            </li>
            <li
              className={activeNav === "settings" ? "active" : ""}
              onClick={() => {
                setActiveNav("settings");
                navigate("/settings");
              }}
            >
              Settings
            </li>
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <main className="main-content">
        <div className="top-bar">
          <h1>Requests</h1>

          <div className="controls">
            <form className="search-bar" onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            <div className="user-profile" ref={profileRef}>
              <div
                className="avatar"
                onClick={() => setShowProfileMenu((s) => !s)}
              >
                {userEmail?.[0]?.toUpperCase() || "U"}
              </div>
              {showProfileMenu && (
                <div className="dropdown-menu">
                  <div
                    onClick={() => {
                      navigate("/settings");
                      setShowProfileMenu(false);
                    }}
                  >
                    Account Settings
                  </div>
                  <div
                    onClick={() => {
                      handleLogout();
                      setShowProfileMenu(false);
                    }}
                  >
                    Logout
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status Filter */}
        <div className="secondary-controls">
          <div className="filter-group">
            <label>Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Requests Grid */}
        <div className="request-grid">
          {filteredRequests.length === 0 && (
            <div className="empty-state">No requests found.</div>
          )}

          {filteredRequests.map((req) => (
            <div className="request-card" key={req._id}>
              <div className="card-header">
                <h3>{req.title}</h3>
                <Badge variant={req.status}>{req.status}</Badge>
              </div>
              <p className="card-desc">{req.description}</p>
              <button
                className="view-btn"
                onClick={() => navigate(`/requests/${req._id}`)}
              >
                View
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
