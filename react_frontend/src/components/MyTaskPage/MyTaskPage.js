import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyTaskPage.css';
import { Badge } from '../ui/button';
import '../ui/button.css';

const MyTaskPage = () => {
  // State for the selected date in calendar and active navigation item
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeNav, setActiveNav] = useState('myTasks');
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [myTasks, setMyTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Navigation hook
  const navigate = useNavigate();
  
  // Ref for profile dropdown
  const profileRef = useRef(null);
  
  // Fetch tasks from backend
  useEffect(() => {
    const fetchMyTasks = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
        
        const response = await fetch('http://localhost:5000/api/feed/mytasks', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const tasks = await response.json();
        
        // Function to get appropriate image based on task content
        const getTaskImage = (task, index) => {
          // If task has an image, use it (check both 'image' and 'picture' fields)
          if (task.image || task.picture) return task.image || task.picture;
          
          // Default images array for variety
          const defaultImages = [
            'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', // Moving boxes
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', // Cleaning supplies
            'https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', // Handyman tools
            'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', // Gardening
            'https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', // Cooking/Food prep
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', // Home maintenance
            'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', // Shopping
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'  // General help
          ];
          
          // Try to match image based on task content
          const title = (task.title || '').toLowerCase();
          const description = (task.description || '').toLowerCase();
          const content = title + ' ' + description;
          
          if (content.includes('mov') || content.includes('pack') || content.includes('box')) {
            return defaultImages[0]; // Moving
          } else if (content.includes('clean') || content.includes('tidy') || content.includes('wash')) {
            return defaultImages[1]; // Cleaning
          } else if (content.includes('fix') || content.includes('repair') || content.includes('install')) {
            return defaultImages[2]; // Handyman
          } else if (content.includes('garden') || content.includes('yard') || content.includes('plant')) {
            return defaultImages[3]; // Gardening
          } else if (content.includes('cook') || content.includes('meal') || content.includes('food')) {
            return defaultImages[4]; // Cooking
          } else if (content.includes('shop') || content.includes('grocery') || content.includes('buy')) {
            return defaultImages[6]; // Shopping
          } else {
            // Use index to cycle through remaining images for variety
            return defaultImages[index % defaultImages.length];
          }
        };

        // Transform the backend data to match your UI structure
        const transformedTasks = tasks.map((task, index) => ({
          id: task._id || task.id,
          title: task.title || `Task ${task._id}`,
          description: task.description || 'No description available',
          location: task.location || 'Location not specified',
          startDate: task.startDate ? new Date(task.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Date not set',
          endDate: task.endTime || task.endDate ? (task.endTime || new Date(task.endDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })) : '6:00 PM',
          image: getTaskImage(task, index),
          status: task.status || 'Active'
        }));
        
        setMyTasks(transformedTasks);
        setError(null);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to load tasks. Please try again.');
        
        // Fallback to sample data if API fails
        setMyTasks([
          {
            id: 7,
            title: 'Sample Task 7',
            description: 'Need help moving furniture from my apartment to a new house. Heavy lifting required. Will provide...',
            location: 'Downtown Seattle, WA',
            startDate: 'Jul 5, 2024',
            endDate: '6:00 PM',
            image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
            status: 'Active'
          },
          {
            id: 8,
            title: 'Sample Task 8',
            description: 'Need help moving furniture from my apartment to a new house. Heavy lifting required. Will provide...',
            location: 'Downtown Seattle, WA',
            startDate: 'Jul 5, 2024',
            endDate: '6:00 PM',
            image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
            status: 'In Progress'
          },
          {
            id: 9,
            title: 'Sample Task 9',
            description: 'Need help moving furniture from my apartment to a new house. Heavy lifting required. Will provide...',
            location: 'Downtown Seattle, WA',
            startDate: 'Jul 5, 2024',
            endDate: '6:00 PM',
            image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
            status: 'Active'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyTasks();
  }, []);
  
  // Handle click outside to close profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileRef]);
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    alert(`Searching for: ${searchQuery}`);
    // Here you would typically filter tasks or make an API call
  };
  
  // Filter tasks based on search query
  const filteredTasks = myTasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calendar functionality
  const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth());
  const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());
  
  // Get month name
  const monthName = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' });
  
  // Generate calendar days
  const generateCalendarDays = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
    
    const days = [];
    
    // Previous month days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        currentMonth: false,
        selected: false
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        currentMonth: true,
        selected: i === selectedDate.getDate() && 
                 currentMonth === selectedDate.getMonth() && 
                 currentYear === selectedDate.getFullYear()
      });
    }
    
    // Next month days (to fill the grid)
    const remainingDays = 42 - days.length; // 6 rows x 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        currentMonth: false,
        selected: false
      });
    }
    
    return days;
  };
  
  // Handle month navigation
  const handlePrevMonth = () => {
    setCurrentMonth(prev => {
      if (prev === 0) {
        setCurrentYear(prevYear => prevYear - 1);
        return 11;
      }
      return prev - 1;
    });
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(prev => {
      if (prev === 11) {
        setCurrentYear(prevYear => prevYear + 1);
        return 0;
      }
      return prev + 1;
    });
  };
  
  // Handle date selection
  const handleDateSelect = (day, isCurrentMonth) => {
    if (isCurrentMonth) {
      setSelectedDate(new Date(currentYear, currentMonth, day));
    }
  };

  // Handle refresh tasks
  const handleRefreshTasks = async () => {
    setLoading(true);
    // Trigger useEffect by changing a dependency or call fetchMyTasks directly
    window.location.reload(); // Simple refresh for now
  };

  return (
    <div className="feed-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">Hire A Helper</div>
        
        <nav className="sidebar-nav">
          <ul>
            <li 
              className={activeNav === 'feed' ? 'active' : ''}
              onClick={() => {
                setActiveNav('feed');
                navigate('/feed');
              }}
            >
              <span>Feed</span>
            </li>
            <li 
              className={activeNav === 'myTasks' ? 'active' : ''}
              onClick={() => setActiveNav('myTasks')}
            >
              <span>My Tasks</span><span className="count">{myTasks.length}</span>
            </li>
            <li 
              className={activeNav === 'requests' ? 'active' : ''}
              onClick={() => setActiveNav('requests')}
            >
              <span>Requests</span>
            </li>
            <li 
              className={activeNav === 'myRequests' ? 'active' : ''}
              onClick={() => setActiveNav('myRequests')}
            >
              <span>My Requests</span>
            </li>
            <li 
              className={activeNav === 'add-task' ? 'active' : ''}
              onClick={() => {
                setActiveNav('add-task');
                navigate('/add-task');
              }}
            >
              <span>Add Task</span>
            </li>
            <li 
              className={activeNav === 'settings' ? 'active' : ''}
              onClick={() => setActiveNav('settings')}
            >
              <span>Settings</span>
            </li>
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
            <div className="weekday">Su</div>
            <div className="weekday">Mo</div>
            <div className="weekday">Tu</div>
            <div className="weekday">We</div>
            <div className="weekday">Th</div>
            <div className="weekday">Fr</div>
            <div className="weekday">Sa</div>
            
            {generateCalendarDays().map((day, index) => (
              <div 
                key={index} 
                className={`day ${!day.currentMonth ? 'prev-month' : ''} ${day.selected ? 'selected' : ''}`}
                onClick={() => handleDateSelect(day.day, day.currentMonth)}
              >
                {day.day}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="main-content">
        {/* Fixed Header with search and user profile */}
        <div className="header1">
          <form className="search-bar" onSubmit={handleSearchSubmit}>
            <button type="submit" className="search-icon">
              <i>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </i>
            </button>
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </form>
          <div className="user-profile" ref={profileRef}>
            <div 
              className="profile-container" 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="user-avatar">
                <img src="https://ui-avatars.com/api/?name=S&background=6c5ce7&color=fff" alt="User" />
              </div>
              <div className="user-info">
                <div className="user-name">shadcn</div>
                <div className="user-email">m@example.com</div>
              </div>
            </div>
            {showProfileMenu && (
              <div className="profile-dropdown">
                <ul>
                  <li>My Profile</li>
                  <li>Account Settings</li>
                  <li>Help Center</li>
                  <li onClick={() => alert('Logging out...')}>Logout</li>
                </ul>
              </div>
            )}  
          </div>
        </div>
        
        {/* Scrollable Content Area */}
        <div className="scrollable-content">
          {/* Add New Task Button */}
          <div className="add-task-button-container">
            <button 
              className="add-task-button"
              onClick={() => {
                setActiveNav('add-task');
                navigate('/add-task');
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
                <path d="M12 5v14M5 12h14"></path>
              </svg>
              Add New Task
            </button>
          </div>
          
          {/* Error Message */}
          {error && (
            <div style={{ 
              padding: '12px', 
              backgroundColor: '#fee', 
              color: '#c33', 
              borderRadius: '6px', 
              margin: '16px 0',
              border: '1px solid #fcc'
            }}>
              {error}
              <button 
                onClick={handleRefreshTasks}
                style={{ 
                  marginLeft: '12px', 
                  padding: '4px 8px', 
                  backgroundColor: '#c33', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px', 
                  cursor: 'pointer' 
                }}
              >
                Retry
              </button>
            </div>
          )}
          
          {/* Loading State */}
          {loading && (
            <div style={{ 
              padding: '40px', 
              textAlign: 'center', 
              color: '#666' 
            }}>
              Loading your tasks...
            </div>
          )}
          
          {/* Empty State */}
          {!loading && !error && filteredTasks.length === 0 && (
            <div style={{ 
              padding: '40px', 
              textAlign: 'center', 
              color: '#666' 
            }}>
              {searchQuery ? `No tasks found matching "${searchQuery}"` : 'No tasks found. Create your first task!'}
            </div>
          )}
          
          {/* Task Grid */}
          {!loading && filteredTasks.length > 0 && (
            <div className="task-grid">
              {filteredTasks.map(task => (
                <div className="task-card" key={task.id}>
                  <div className="task-image">
                    <img src={task.image} alt={task.title} />
                  </div>
                  <h3 className="task-title">{task.title}</h3>
                  <p className="task-description">{task.description}</p>
                  <div className="task-details">
                    <p className="task-location">
                      <i className="location-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                      </i> 
                      {task.location}
                    </p>
                    <p className="task-dates">
                      <i className="calendar-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                      </i>
                      <span>{task.startDate} • 2:00 PM - {task.endDate}</span>
                    </p>
                  </div>
                  <div className="task-status-container">
                    <Badge variant={task.status.toLowerCase().replace(' ', '-')}>
                      {task.status}
                    </Badge>
                  </div>
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