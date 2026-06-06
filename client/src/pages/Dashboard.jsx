import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api'; 
import './Dashboard.css';

const Dashboard = () => {
  const [userName, setUserName] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // Tasks Dataset states
  const [tasks, setTasks] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);

  // SEARCH & CATEGORY FILTER STATES
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all', 'pending', 'completed'

  // ADD TASK STATES
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [taskError, setTaskError] = useState('');
  const [taskLoading, setTaskLoading] = useState(false);

  // EDIT TASK STATES
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [editTaskId, setEditTaskId] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editTaskError, setEditTaskError] = useState('');
  const [editTaskLoading, setEditTaskLoading] = useState(false);

  // DELETE TASK STATES
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState('');
  const [deleteTaskLoading, setDeleteTaskLoading] = useState(false);

  // ➡️ NEW: VIEW TASK DETAILS STATES
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDetailTask, setSelectedDetailTask] = useState(null);
  
  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const storedUser = localStorage.getItem('userInfo');
    if (!storedUser) return {};
    try {
      const parsedData = JSON.parse(storedUser);
      return {
        headers: {
          Authorization: `Bearer ${parsedData.token}`
        }
      };
    } catch (e) {
      return {};
    }
  };

  const fetchTasks = async () => {
    try {
      const config = getAuthHeaders();
      const response = await API.get('/tasks', config);
      if (Array.isArray(response.data)) {
        setTasks(response.data);
      } else if (response.data && Array.isArray(response.data.tasks)) {
        setTasks(response.data.tasks);
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (!storedUser) {
      navigate('/');
    } else {
      try {
        const parsedData = JSON.parse(storedUser);
        // ➡️ FIXED: Fallback backup user string parameter strictly mapped to generic 'User'
        const name = parsedData.user?.name || parsedData.name || 'User';
        setUserName(name);
        fetchTasks();
      } catch (error) {
        localStorage.removeItem('userInfo');
        navigate('/');
      }
    }
  }, [navigate]);

  const handleToggleStatus = async (taskId, currentStatus) => {
    if (statusUpdatingId) return;
    const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    setStatusUpdatingId(taskId);

    try {
      const config = getAuthHeaders();
      const response = await API.put(`/tasks/${taskId}`, { status: nextStatus }, config);
      if (response.status === 200 || response.status === 201 || response.data) {
        await fetchTasks();
      }
    } catch (err) {
      console.error("Error toggling status:", err);
      alert('Failed to modify task parameters.');
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const handleAddTaskSubmit = async (e) => {
    e.preventDefault();
    setTaskError('');

    if (!title.trim() || !description.trim()) {
      setTaskError('Both Title and Description are required.');
      return;
    }

    setTaskLoading(true);

    try {
      const config = getAuthHeaders();
      const response = await API.post('/tasks', { title: title.trim(), description: description.trim() }, config);
      if (response.status === 201 || response.status === 200) {
        setTitle('');
        setDescription('');
        setShowAddTaskModal(false); 
        fetchTasks();
      }
    } catch (err) {
      setTaskError(err.response?.data?.message || 'Failed to add task.');
    } finally {
      setTaskLoading(false);
    }
  };

  const openEditModal = (task) => {
    setEditTaskId(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditTaskError('');
    setShowEditTaskModal(true);
  };

  const handleEditTaskSubmit = async (e) => {
    e.preventDefault();
    setEditTaskError('');

    if (!editTitle.trim() || !editDescription.trim()) {
      setEditTaskError('Both Title and Description are required.');
      return;
    }

    setEditTaskLoading(true);

    try {
      const config = getAuthHeaders();
      const response = await API.put(`/tasks/${editTaskId}`, { 
        title: editTitle.trim(), 
        description: editDescription.trim() 
      }, config);

      if (response.status === 200 || response.status === 201 || response.data) {
        setShowEditTaskModal(false);
        fetchTasks();
      }
    } catch (err) {
      setEditTaskError(err.response?.data?.message || 'Failed to update task parameters.');
    } finally {
      setEditTaskLoading(false);
    }
  };

  const triggerDeleteConfirm = (taskId) => {
    setDeleteTaskId(taskId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteTaskExecute = async () => {
    setDeleteTaskLoading(true);
    try {
      const config = getAuthHeaders();
      const response = await API.delete(`/tasks/${deleteTaskId}`, config);
      if (response.status === 200 || response.status === 204 || response.data) {
        setShowDeleteConfirm(false);
        fetchTasks(); 
      }
    } catch (err) {
      console.error("Error deleting task:", err);
      alert('Failed to delete target milestone task.');
    } finally {
      setDeleteTaskLoading(false);
    }
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  // Dynamic helper to parse chronological stamp elements matching instructions exactly
  const formatTaskDate = (dateString, includeTime = false) => {
    if (!dateString) return 'Recent';
    try {
      const dateObj = new Date(dateString);
      const day = String(dateObj.getDate()).padStart(2, '0');
      const month = dateObj.toLocaleDateString(undefined, { month: 'short' });
      const year = dateObj.getFullYear();
      
      if (!includeTime) {
        return `${day} ${month} ${year}`;
      }

      let hours = dateObj.getHours();
      const minutes = String(dateObj.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const formattedHours = String(hours).padStart(2, '0');

      return `${day} ${month} ${year} • ${formattedHours}:${minutes} ${ampm}`;
    } catch (e) {
      return 'Recent';
    }
  };

  // 🔍 Opens the custom task details sheet view modal
  const handleOpenDetails = (task) => {
    setSelectedDetailTask(task);
    setShowDetailsModal(true);
  };

  // Category-wise filtering logic + context text searching matched perfectly
  const filteredTasks = tasks.filter(task => {
    if (selectedCategory !== 'all' && task.status !== selectedCategory) {
      return false;
    }
    const titleMatch = task.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const descMatch = task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return titleMatch || descMatch;
  });

  // Pure Backend Schema Counters
  const totalTasksCount = tasks.length;
  const completedTasksCount = tasks.filter(t => t.status === 'completed').length;
  const pendingTasksCount = tasks.filter(t => t.status === 'pending').length;

  return (
    <div className={`dashboard-container ${showLogoutConfirm || showAddTaskModal || showEditTaskModal || showDeleteConfirm || showDetailsModal ? 'modal-blur-active' : ''}`}>
      <div className="dashboard-grid-overlay"></div>
      <div className="dashboard-ambient-glow"></div>

      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="dashboard-logo-badge">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="logo-icon">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <span className="dashboard-brand-name">Task<span className="purple-text">Flow</span></span>
        </div>

        {/* Global/Category Specific Working Search Box */}
        <div className="header-search-center">
          <div className="search-bar-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="search-lens-icon">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.604 10.604z" />
            </svg>
            <input 
              type="text" 
              placeholder={selectedCategory === 'all' ? "Search all tasks..." : `Search in ${selectedCategory} tasks...`} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="global-search-input"
            />
          </div>
        </div>

        <div className="header-right">
          <span className="welcome-msg">
            Welcome, <span className="user-highlight">{userName}</span> <span className="waving-emoji">👋</span>
          </span>
          <button onClick={() => setShowLogoutConfirm(true)} className="logout-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="logout-icon-svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            Logout
          </button>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <main className="dashboard-content">
        
        {/* Clickable Stat Counters for Category Switching */}
        <section className="stats-section">
          <button 
            type="button"
            onClick={() => setSelectedCategory('all')} 
            className={`stat-card stat-card-btn ${selectedCategory === 'all' ? 'active-filter-all' : ''}`}
          >
            <p className="stat-label">Total Tasks</p>
            <div className="stat-value-wrapper">
              <h3 className="stat-value">{totalTasksCount}</h3>
              <div className="status-indicator-ring"><div className="status-dot"></div></div>
            </div>
          </button>

          <button 
            type="button"
            onClick={() => setSelectedCategory('completed')} 
            className={`stat-card stat-card-btn ${selectedCategory === 'completed' ? 'active-filter-completed' : ''}`}
          >
            <p className="stat-label">Completed Tasks</p>
            <div className="stat-value-wrapper">
              <h3 className="stat-value">{completedTasksCount}</h3>
              <div className="status-indicator-ring ring-completed"><div className="status-dot dot-completed"></div></div>
            </div>
          </button>

          <button 
            type="button"
            onClick={() => setSelectedCategory('pending')} 
            className={`stat-card stat-card-btn ${selectedCategory === 'pending' ? 'active-filter-pending' : ''}`}
          >
            <p className="stat-label">Pending Tasks</p>
            <div className="stat-value-wrapper">
              <h3 className="stat-value">{pendingTasksCount}</h3>
              <div className="status-indicator-ring ring-pending"><div className="status-dot dot-pending"></div></div>
            </div>
          </button>
        </section>

        <div className="action-bar">
          <div className="title-area-with-badge">
            <h2 className="section-title">My Tasks</h2>
            <span className="current-view-mode-badge">
              Showing: <span className="purple-text uppercase-bold">{selectedCategory}</span>
            </span>
          </div>
          <button onClick={() => setShowAddTaskModal(true)} className="add-task-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="plus-icon">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Task
          </button>
        </div>

        {fetchLoading ? (
          <div className="workspace-loader-state">
            <span className="spinner-glow"></span>
            <p>Loading workspace parameters...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="empty-state-card">
            <div className="empty-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="empty-box-icon">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.008 1.24l.885 1.77a2.25 2.25 0 002.007 1.24h1.98a2.25 2.25 0 002.007-1.24l.885-1.77a2.25 2.25 0 012.007-1.24h3.86m-18 0h18a2.25 2.25 0 012.25 2.25v4.25A2.25 2.25 0 0118 21H6a2.25 2.25 0 01-2.25-2.25v-4.25a2.25 2.25 0 012.25-2.25zm0-4.5h18A2.25 2.25 0 0022 6.75V4.5a2.25 2.25 0 00-2.25-2.25H4.5A2.25 2.25 0 002.25 4.5v2.25A2.25 2.25 0 004.5 9z" />
              </svg>
            </div>
            <h3>No tasks found</h3>
            <p>No records match your selected category or filter query inputs.</p>
          </div>
        ) : (
          <div className="tasks-grid-layout">
            {filteredTasks.map((task) => {
              const isTaskComplete = task.status === 'completed';
              const currentStatusNormalized = isTaskComplete ? 'completed' : 'pending';

              return (
                /* ➡️ Click triggers details modal display logic */
                <div key={task._id} className="task-item-card" onClick={() => handleOpenDetails(task)} style={{ cursor: 'pointer' }}>
                  {/* Status Badge */}
                  <div className="task-card-top-status-bar">
                    <span className={`task-badge-status ${isTaskComplete ? 'badge-complete' : 'badge-pending'}`}>
                      {isTaskComplete ? 'Completed' : 'Pending'}
                    </span>
                  </div>

                  <div className="task-card-header">
                    <h4 className="task-card-title">{task.title}</h4>
                  </div>
                  
                  {/* Long description strings are cleanly managed inside 2 lines track cutoff thresholds */}
                  <p className="task-card-description truncate-text-line">{task.description}</p>
                  
                  {/* ➡️ Action panel zone interceptors wrapped inside stopPropagation explicitly */}
                  <div className="task-card-footer" onClick={(e) => e.stopPropagation()}>
                    <span className="task-date-stamp">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="calendar-mini-icon">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                      {formatTaskDate(task.createdAt)}
                    </span>

                    {/* Action Controls Grouped Cleanly at Bottom Right Corner */}
                    <div className="task-card-bottom-actions-group">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(task._id, currentStatusNormalized)}
                        className={`status-action-toggle-btn-small ${isTaskComplete ? 'action-to-pending' : 'action-to-complete'}`}
                        disabled={statusUpdatingId === task._id}
                      >
                        {statusUpdatingId === task._id ? '...' : isTaskComplete ? 'Mark Pending' : 'Mark Complete'}
                      </button>

                      <button onClick={() => openEditModal(task)} className="card-action-icon-btn edit-tint" title="Edit Task">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </button>

                      <button onClick={() => triggerDeleteConfirm(task._id)} className="card-action-icon-btn delete-tint" title="Delete Task">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ➡️ TASK DETAILS MODAL VIEW OVERLAY PANEL */}
      {showDetailsModal && selectedDetailTask && (
        <div className="modal-backdrop" onClick={() => { setShowDetailsModal(false); setSelectedDetailTask(null); }}>
          <div className="task-modal-card detailed-view-card-template" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-wrapper line-border-bottom">
              <div className="details-badge-heading-layout">
                <span className={`task-badge-status ${selectedDetailTask.status === 'completed' ? 'badge-complete' : 'badge-pending'}`}>
                  {selectedDetailTask.status === 'completed' ? 'Completed' : 'Pending'}
                </span>
                <h3>Task Details</h3>
              </div>
              <button type="button" onClick={() => { setShowDetailsModal(false); setSelectedDetailTask(null); }} className="modal-close-x-btn">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="detailed-modal-body-scroll-view">
              <div className="detail-data-section">
                <label>Title</label>
                <h2 className="untruncated-title-text">{selectedDetailTask.title}</h2>
              </div>

              <div className="detail-data-section">
                <label>Description</label>
                <p className="untruncated-desc-paragraph">{selectedDetailTask.description}</p>
              </div>

              <div className="detail-data-section timestamp-meta-row">
                <label>Created</label>
                <span className="meta-badge-text-stamp">
                  {formatTaskDate(selectedDetailTask.createdAt, true)}
                </span>
              </div>
            </div>

            <div className="modal-form-actions patch-top-margin">
              <button type="button" onClick={() => { setShowDetailsModal(false); setSelectedDetailTask(null); }} className="task-btn-secondary close-firm-action-btn">
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD TASK MODAL */}
      {showAddTaskModal && (
        <div className="modal-backdrop">
          <div className="task-modal-card">
            <div className="modal-header-wrapper">
              <h3>Create New Task</h3>
              <button type="button" onClick={() => { setShowAddTaskModal(false); setTaskError(''); }} className="modal-close-x-btn">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleAddTaskSubmit} className="task-modal-form">
              <div className="modal-input-group">
                <label htmlFor="taskTitle">Task Title</label>
                <input
                  type="text"
                  id="taskTitle"
                  placeholder="e.g., Configure Protected Route Middleware"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="modal-input-group">
                <label htmlFor="taskDesc">Description</label>
                <textarea
                  id="taskDesc"
                  placeholder="Elaborate project milestone details here..."
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>

              {taskError && (
                <div className="modal-form-error-msg">
                  {taskError}
                </div>
              )}

              <div className="modal-form-actions">
                <button type="button" onClick={() => { setShowAddTaskModal(false); setTaskError(''); }} className="task-btn-secondary" disabled={taskLoading}>
                  Cancel
                </button>
                <button type="submit" className="task-btn-primary" disabled={taskLoading}>
                  {taskLoading ? 'Adding Task...' : 'Add Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT TASK MODAL */}
      {showEditTaskModal && (
        <div className="modal-backdrop">
          <div className="task-modal-card">
            <div className="modal-header-wrapper">
              <h3>Edit Milestone Task</h3>
              <button type="button" onClick={() => { setShowEditTaskModal(false); setEditTaskError(''); }} className="modal-close-x-btn">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleEditTaskSubmit} className="task-modal-form">
              <div className="modal-input-group">
                <label htmlFor="editTaskTitle">Task Title</label>
                <input
                  type="text"
                  id="editTaskTitle"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                />
              </div>

              <div className="modal-input-group">
                <label htmlFor="editTaskDesc">Description</label>
                <textarea
                  id="editTaskDesc"
                  rows="4"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  required
                ></textarea>
              </div>

              {editTaskError && (
                <div className="modal-form-error-msg">
                  {editTaskError}
                </div>
              )}

              <div className="modal-form-actions">
                <button type="button" onClick={() => { setShowEditTaskModal(false); setEditTaskError(''); }} className="task-btn-secondary" disabled={editTaskLoading}>
                  Cancel
                </button>
                <button type="submit" className="task-btn-primary" disabled={editTaskLoading}>
                  {editTaskLoading ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteConfirm && (
        <div className="modal-backdrop">
          <div className="confirm-modal-card">
            <h3>Delete Task?</h3>
            <p>Are you sure you want to delete this task permanently?</p>
            <div className="modal-action-buttons">
              <button type="button" onClick={() => setShowDeleteConfirm(false)} className="modal-cancel-btn" disabled={deleteTaskLoading}>
                Cancel
              </button>
              <button type="button" onClick={handleDeleteTaskExecute} className="modal-submit-red-btn" disabled={deleteTaskLoading}>
                {deleteTaskLoading ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutConfirm && (
        <div className="modal-backdrop">
          <div className="confirm-modal-card">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to end your current session?</p>
            <div className="modal-action-buttons">
              <button type="button" onClick={() => setShowLogoutConfirm(false)} className="modal-cancel-btn">
                Cancel
              </button>
              <button type="button" onClick={handleConfirmLogout} className="modal-submit-red-btn">
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;