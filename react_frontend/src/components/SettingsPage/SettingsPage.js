import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SettingsPage.css";

const navTabs = [
{ id: "myTasks", label: "My Tasks", path: "/my-tasks" },
{ id: "requests", label: "Requests", path: "/request" },
{ id: "myRequests", label: "My Requests", path: "/my-request" },
{ id: "addTask", label: "Add Task", path: "/add-task" },
{ id: "settings", label: "Settings", path: "/settings" },
];

export default function SettingsPage() {
const navigate = useNavigate();
const [activeNav, setActiveNav] = useState("settings");

const [formData, setFormData] = useState({
firstName: "",
lastName: "",
dob: "",
phone: "",
email: "",
profilePic: null,
profilePicPreview: null,
});

const handleChange = (e) => {
const { name, value } = e.target;
setFormData({ ...formData, [name]: value });
};

const handleProfilePicChange = (e) => {
const file = e.target.files[0];
if (file) {
setFormData({
...formData,
profilePic: file,
profilePicPreview: URL.createObjectURL(file),
});
}
};

const handleRemoveProfilePic = () => {
setFormData({
...formData,
profilePic: null,
profilePicPreview: null,
});
};

return (
<div className="settings-container">
{/* Sidebar */}
<aside className="settings-sidebar">
<ul>
{navTabs.map((tab) => (
<li
key={tab.id}
className={activeNav === tab.id ? "active" : ""}
onClick={() => {
setActiveNav(tab.id);
navigate(tab.path);
}}
>
{tab.label}
</li>
))}
</ul>
</aside>

  {/* Main Content */}
  <main className="settings-main">
    <div className="settings-content">
      <h2>Account</h2>
      <p className="desc">Update your account settings.</p>

      <div className="profile-section">
        <div className="profile-pic">
          {formData.profilePicPreview ? (
            <img
              src={formData.profilePicPreview}
              alt="Profile"
              className="profile-img"
            />
          ) : (
            <div className="avatar">👤</div>
          )}
        </div>
        <div className="pic-buttons">
          <button
            className="btn-primary"
            onClick={() => document.getElementById("fileInput").click()}
          >
            Change Photo
          </button>
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleProfilePicChange}
          />
          <button
            className="btn-secondary"
            onClick={handleRemoveProfilePic}
            disabled={!formData.profilePicPreview}
          >
            Remove Photo
          </button>
        </div>
      </div>

      <form className="settings-form">
        <div className="form-row">
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First name"
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last name"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
          />
        </div>

        <div className="form-group">
          <label>Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Save Changes
          </button>
          <button type="button" className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  </main>
</div>


);
}