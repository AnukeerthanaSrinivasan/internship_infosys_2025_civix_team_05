import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./RequestPage.css";

function RequestPage() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("requests");
  const [activeTab, setActiveTab] = useState("all");
  const [showDropdown, setShowDropdown] = useState(false);

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(today);

  const [requests, setRequests] = useState([
    {
      id: 1,
      name: "William Smith",
      title: "Meeting Tomorrow",
      description: "Hi, let’s have a meeting tomorrow to discuss the project...",
      time: "about 1 year ago",
      unread: true,
      status: "Pending",
    },
    {
      id: 2,
      name: "Alice Smith",
      title: "Re: Project Update",
      description: "Thank you for the project update. It looks great!...",
      time: "about 1 year ago",
      unread: false,
      status: "Pending",
    },
    {
      id: 3,
      name: "Bob Johnson",
      title: "Weekend Plans",
      description: "Any plans for the weekend? Hiking maybe?",
      time: "over 1 year ago",
      unread: true,
      status: "Pending",
    },
  ]);

  // Fetch user info from localStorage
  const [user, setUser] = useState({ name: "User", email: "email@example.com" });
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  // Accept/Decline toggle
  const handleStatusChange = (id, newStatus) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: r.status === newStatus ? "Pending" : newStatus,
              unread: false,
            }
          : r
      )
    );
  };

  // Calendar helpers
  const monthName = new Date(currentYear, currentMonth).toLocaleString("default", { month: "long" });
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  // Filter requests
  const filteredRequests = activeTab === "unread" ? requests.filter((r) => r.unread) : requests;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="request-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">Hire A Helper</div>
        <nav className="sidebar-nav">
          <ul>
<<<<<<< Updated upstream
            <li className={activeNav === 'feed' ? 'active' : ''} onClick={() => { setActiveNav('feed'); navigate('/feed'); }}>Feed</li>
            <li className={activeNav === 'myTasks' ? 'active' : ''} onClick={() => { setActiveNav('myTasks'); navigate('/my-tasks'); }}>My Tasks</li>
            <li className={activeNav === 'requests' ? 'active' : ''} onClick={() => { setActiveNav('requests'); navigate('/request'); }}>Requests</li>
            <li className={activeNav === 'myRequests' ? 'active' : ''} onClick={() => { setActiveNav('myRequests'); navigate('/my-request'); }}>My Requests</li>
            <li className={activeNav === 'addTask' ? 'active' : ''} onClick={() => { setActiveNav('addTask'); navigate('/add-task'); }}>Add Task</li>
            <li className={activeNav === 'settings' ? 'active' : ''} onClick={() => {setActiveNav('settings'); navigate('/settings')}}><span>Settings</span></li>
=======
            <li
              className={activeNav === "feed" ? "active" : ""}
              onClick={() => {
                setActiveNav("feed");
                navigate("/feed");
              }}
            >
              Feed <span className="count">9</span>
            </li>
            <li
              className={activeNav === "myTasks" ? "active" : ""}
              onClick={() => {
                setActiveNav("myTasks");
                navigate("/my-tasks");
              }}
            >
              My Tasks <span className="count">9</span>
            </li>
            <li
              className={activeNav === "requests" ? "active" : ""}
              onClick={() => {
                setActiveNav("requests");
                navigate("/requests");
              }}
            >
              Requests <span className="count">{requests.length}</span>
            </li>
            <li
              className={activeNav === "myRequests" ? "active" : ""}
              onClick={() => {
                setActiveNav("myRequests");
                navigate("/my-requests");
              }}
            >
              My Requests <span className="count">23</span>
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
>>>>>>> Stashed changes
          </ul>
        </nav>

        {/* Calendar */}
        <div className="calendar-widget">
          <div className="calendar-header">
            <button
              onClick={() =>
                currentMonth === 0
                  ? (setCurrentMonth(11), setCurrentYear(currentYear - 1))
                  : setCurrentMonth(currentMonth - 1)
              }
            >
              &lt;
            </button>
            <div className="current-month">{monthName} {currentYear}</div>
            <button
              onClick={() =>
                currentMonth === 11
                  ? (setCurrentMonth(0), setCurrentYear(currentYear + 1))
                  : setCurrentMonth(currentMonth + 1)
              }
            >
              &gt;
            </button>
          </div>
          <div className="calendar-days">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div key={d} className="weekday">{d}</div>
            ))}
            {calendarDays.map((d, i) => (
              <div
                key={i}
                className={`day ${d && d === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear() ? "selected" : ""}`}
                onClick={() => d && setSelectedDate(new Date(currentYear, currentMonth, d))}
              >
                {d || ""}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="main-content">
        <div className="top-bar">
          <form className="search-bar">
            <input type="text" placeholder="Search products..." />
          </form>

          <div className="tabs">
            <button className={activeTab === "all" ? "active" : ""} onClick={() => setActiveTab("all")}>All Req</button>
            <button className={activeTab === "unread" ? "active" : ""} onClick={() => setActiveTab("unread")}>Unread</button>
          </div>

          {/* User Profile */}
          <div className="user-profile" onClick={() => setShowDropdown(!showDropdown)}>
            <div className="avatar">{user?.name?.[0]?.toUpperCase() || "U"}</div>
            <div>
              <div className="username">{user?.name || "User"}</div>
              <div className="email">{user?.email || "email@example.com"}</div>
            </div>
            {showDropdown && (
              <div className="dropdown-menu">
                <div onClick={() => { navigate("/settings"); setShowDropdown(false); }}>Account Settings</div>
                <div onClick={() => { handleLogout(); setShowDropdown(false); }}>Logout</div>
              </div>
            )}
          </div>
        </div>

        <h2 className="section-title">Incoming Requests</h2>

        {/* Request list */}
        <div className="request-list">
          {filteredRequests.map((req) => (
            <div className="request-item" key={req.id}>
              <div className="request-info">
                <h4>{req.name}</h4>
                <div className="request-title">{req.title}</div>
                <p className="request-desc">{req.description}</p>
                <div className="actions">
                  {req.status === "Pending" ? (
                    <>
                      <span className="pill accept" onClick={() => handleStatusChange(req.id, "Accepted")}>Accept</span>
                      <span className="pill decline" onClick={() => handleStatusChange(req.id, "Declined")}>Decline</span>
                    </>
                  ) : (
                    <span className={`pill status ${req.status === "Accepted" ? "accept-badge" : "decline-badge"}`} onClick={() => handleStatusChange(req.id, req.status)}>
                      {req.status}
                    </span>
                  )}
                </div>
              </div>
              <div className="request-time">{req.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RequestPage;
