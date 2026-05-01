import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Plus, CheckSquare, Clock, AlertCircle } from 'lucide-react';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', projectId: '', dueDate: '', assignedTo: [] });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
    if (user?.role === 'admin') {
      fetchProjects();
      fetchAllUsers();
    }
  }, [user]);

  const fetchAllUsers = async () => {
    try {
      const res = await api.get('/auth/users');
      setAllUsers(res.data.data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data.data);
    } catch (error) {
      console.error("Error fetching tasks", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data.data);
    } catch (error) {
      console.error("Error fetching projects", error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', newTask);
      setShowCreateModal(false);
      setNewTask({ title: '', description: '', projectId: '', dueDate: '', assignedTo: [] });
      fetchTasks();
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating task');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      fetchTasks();
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating task');
    }
  };

  const handleEditClick = (task) => {
    setEditingTask({
      ...task,
      projectId: task.projectId?._id || task.projectId,
      assignedTo: task.assignedTo ? task.assignedTo.map(u => u._id) : []
    });
    setShowEditModal(true);
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/tasks/${editingTask._id}`, editingTask);
      setShowEditModal(false);
      setEditingTask(null);
      fetchTasks();
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating task');
    }
  };

  if (loading) return <div className="text-muted">Loading tasks...</div>;

  const getStatusClass = (status) => {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'in-progress': return 'status-inprogress';
      default: return 'status-todo';
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Tasks</h2>
          <p className="text-sm mt-1">Manage and track your tasks</p>
        </div>
        {user?.role === 'admin' && (
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-primary-sm flex items-center gap-2"
          >
            <Plus size={18} /> New Task
          </button>
        )}
      </div>

      <div className="tasks-list">
        {tasks.map((task) => (
          <div key={task._id} className="glass task-item">
            <div className="task-info-wrapper">
              <div className={`task-icon-container ${task.status === 'completed' ? 'task-icon-done' : 'task-icon-pending'}`}>
                <CheckSquare size={20} />
              </div>
              <div>
                <h3 style={{ marginBottom: '4px' }}>{task.title}</h3>
                <p className="text-sm text-muted">{task.description}</p>
                <div className="task-meta">
                  <span className="task-project-tag">
                    {task.projectId?.title || 'Unknown Project'}
                  </span>
                  {task.dueDate && (
                    <span className="task-date">
                      <Clock size={14} /> {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="task-actions">
              <div className="task-assignee">
                <p className="task-assignee-label">Assigned to</p>
                <p className="task-assignee-name">{task.assignedTo && task.assignedTo.length > 0 ? task.assignedTo.map(u => u.name).join(', ') : 'Unassigned'}</p>
              </div>
              
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {user?.role === 'admin' && (
                  <button onClick={() => handleEditClick(task)} className="btn-secondary" style={{ padding: '4px 8px', fontSize: '12px' }}>Edit</button>
                )}
                <select 
                  value={task.status}
                  onChange={(e) => handleStatusChange(task._id, e.target.value)}
                  className={`status-select ${getStatusClass(task.status)}`}
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="glass empty-state">
            <AlertCircle size={48} />
            <h3 style={{ marginBottom: '4px' }}>No tasks found</h3>
            <p className="text-sm">You don't have any tasks assigned yet.</p>
          </div>
        )}
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="glass modal-content">
            <h3 style={{ marginBottom: '24px' }}>Create New Task</h3>
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label className="form-label">Task Title</label>
                <input 
                  type="text" required
                  value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Project</label>
                <select 
                  required
                  value={newTask.projectId} onChange={e => setNewTask({...newTask, projectId: e.target.value})}
                  className="form-input"
                  style={{ appearance: 'none' }}
                >
                  <option value="">Select a project</option>
                  {projects.map(p => (
                    <option key={p._id} value={p._id}>{p.title}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Assign To</label>
                <div className="checkbox-list" style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px' }}>
                  {allUsers.map(u => (
                    <label key={u._id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={newTask.assignedTo.includes(u._id)}
                        onChange={(e) => {
                          const newAssignedTo = e.target.checked 
                            ? [...newTask.assignedTo, u._id]
                            : newTask.assignedTo.filter(id => id !== u._id);
                          setNewTask({...newTask, assignedTo: newAssignedTo});
                        }}
                      />
                      {u.name} ({u.email})
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  required rows="3"
                  value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})}
                  className="form-input"
                  style={{ resize: 'none' }}
                ></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input 
                  type="date"
                  value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                  className="form-input"
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary-sm">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {showEditModal && editingTask && (
        <div className="modal-overlay">
          <div className="glass modal-content">
            <h3 style={{ marginBottom: '24px' }}>Edit Task</h3>
            <form onSubmit={handleUpdateTask}>
              <div className="form-group">
                <label className="form-label">Task Title</label>
                <input 
                  type="text" required
                  value={editingTask.title} onChange={e => setEditingTask({...editingTask, title: e.target.value})}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Project</label>
                <select 
                  required
                  value={editingTask.projectId} onChange={e => setEditingTask({...editingTask, projectId: e.target.value})}
                  className="form-input"
                  style={{ appearance: 'none' }}
                >
                  <option value="">Select a project</option>
                  {projects.map(p => (
                    <option key={p._id} value={p._id}>{p.title}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Assign To</label>
                <div className="checkbox-list" style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px' }}>
                  {allUsers.map(u => (
                    <label key={u._id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={editingTask.assignedTo.includes(u._id)}
                        onChange={(e) => {
                          const newAssignedTo = e.target.checked 
                            ? [...editingTask.assignedTo, u._id]
                            : editingTask.assignedTo.filter(id => id !== u._id);
                          setEditingTask({...editingTask, assignedTo: newAssignedTo});
                        }}
                      />
                      {u.name} ({u.email})
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  required rows="3"
                  value={editingTask.description} onChange={e => setEditingTask({...editingTask, description: e.target.value})}
                  className="form-input"
                  style={{ resize: 'none' }}
                ></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input 
                  type="date"
                  value={editingTask.dueDate ? new Date(editingTask.dueDate).toISOString().split('T')[0] : ''} 
                  onChange={e => setEditingTask({...editingTask, dueDate: e.target.value})}
                  className="form-input"
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowEditModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary-sm">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
