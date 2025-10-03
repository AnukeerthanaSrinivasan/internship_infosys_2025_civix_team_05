
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./RequestPage.css";

function MyRequestPage() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("my-requests");
  const [user, setUser] = useState({
    name: "Harshit Rai",
    email: "harshit23btaml34@gmail.com",
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [badges, setBadges] = useState({
    feed: 0,
    tasks: 0,
    requests: 0,
    myRequests: 0,
  });

  useEffect(() => {
    // later you will fetch these from backend API
    setBadges({
      feed: 2,
      tasks: 0,
      requests: 5,
      myRequests: 3,
    });
  }, []);

  const handleNavClick = (nav) => {
    setActiveNav(nav);
    navigate(`/${nav}`);
  };

  return (
    <div className="request-page">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">Hire A Helper</h2>
        <ul>
          <li
            className={activeNav === "feed" ? "active" : ""}
            onClick={() => handleNavClick("feed")}
          >
            Feed <span className="count">{badges.feed}</span>
          </li>
          <li
            className={activeNav === "my-tasks" ? "active" : ""}
            onClick={() => handleNavClick("my-tasks")}
          >
            My Tasks <span className="count">{badges.tasks}</span>
          </li>
          <li
            className={activeNav === "requests" ? "active" : ""}
            onClick={() => handleNavClick("requests")}
          >
            Requests <span className="count">{badges.requests}</span>
          </li>
          <li
            className={activeNav === "my-requests" ? "active" : ""}
            onClick={() => handleNavClick("my-requests")}
          >
            My Requests <span className="count">{badges.myRequests}</span>
          </li>
          <li
            className={activeNav === "add-task" ? "active" : ""}
            onClick={() => handleNavClick("add-task")}
          >
            Add Task
          </li>
          <li
            className={activeNav === "settings" ? "active" : ""}
            onClick={() => handleNavClick("settings")}
          >
            Settings
          </li>
        </ul>

        {/* Calendar */}
        <div className="calendar">
          <div className="calendar-header">
            <button>{"<"}</button>
            <span>October 2025</span>
            <button>{">"}</button>
          </div>
          <div className="calendar-grid">
            <div className="weekday">Su</div>
            <div className="weekday">Mo</div>
            <div className="weekday">Tu</div>
            <div className="weekday">We</div>
            <div className="weekday">Th</div>
            <div className="weekday">Fr</div>
            <div className="weekday">Sa</div>
            {/* Example days */}
            {Array.from({ length: 35 }, (_, i) => (
              <div
                key={i}
                className={`day ${i === 5 ? "active-day" : ""}`}
              >
                {i + 1 <= 31 ? i + 1 : ""}
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="topbar">
          <input type="text" placeholder="Search tasks..." />
          <div
            className="user-badge"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="avatar">{user.name.charAt(0)}</div>
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-email">{user.email}</span>
            </div>
          </div>
          {dropdownOpen && (
            <div className="dropdown">
              <div onClick={() => navigate("/settings")}>Account Settings</div>
              <div onClick={() => navigate("/logout")}>Logout</div>
            </div>
          )}
        </div>

        <div className="content">
          <p>No requests found. Create your first request!</p>
        </div>
      </main>
    </div>
  );
}

export default MyRequestPage;

