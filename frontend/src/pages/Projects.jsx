import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Plus, Users, FolderKanban } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  
  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', description: '' });
  
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    fetchProjects();
    if (user?.role === 'admin') fetchAllUsers();
  }, [user]);

  const fetchAllUsers = async () => {
    try {
      const res = await api.get('/auth/users');
      setAllUsers(res.data.data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data.data);
    } catch (error) {
      console.error("Error fetching projects", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', newProject);
      setShowCreateModal(false);
      setNewProject({ title: '', description: '' });
      fetchProjects();
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating project');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/projects/${selectedProjectId}/add-member`, { email: memberEmail });
      setShowAddMemberModal(false);
      setMemberEmail('');
      setSelectedProjectId(null);
      fetchProjects();
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding member');
    }
  };

  if (loading) return <div className="text-muted">Loading projects...</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Projects</h2>
          <p className="text-sm mt-1">Manage your team's projects</p>
        </div>
        {user?.role === 'admin' && (
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-primary-sm flex items-center gap-2"
          >
            <Plus size={18} /> New Project
          </button>
        )}
      </div>

      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project._id} className="glass project-card card">
            <div className="project-header">
              <div className="project-icon">
                <FolderKanban size={24} />
              </div>
              {user?.role === 'admin' && (
                <button 
                  onClick={() => { setSelectedProjectId(project._id); setShowAddMemberModal(true); }}
                  className="icon-btn"
                  title="Add Member"
                >
                  <Users size={18} />
                </button>
              )}
            </div>
            
            <h3 style={{ marginBottom: '8px' }}>{project.title}</h3>
            <p className="project-desc">{project.description}</p>
            
            <div className="project-footer">
              <div className="text-sm text-muted">
                <span className="font-medium text-main">{project.tasks?.length || 0}</span> tasks
              </div>
              <div className="member-avatars">
                {project.members.slice(0, 3).map((member, i) => (
                  <div key={member._id} className="member-avatar" title={member.name}>
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                ))}
                {project.members.length > 3 && (
                  <div className="member-avatar" style={{ color: 'var(--text-muted)' }}>
                    +{project.members.length - 3}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="glass modal-content">
            <h3 style={{ marginBottom: '24px' }}>Create New Project</h3>
            <form onSubmit={handleCreateProject}>
              <div className="form-group">
                <label className="form-label">Project Title</label>
                <input 
                  type="text" required
                  value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  required rows="3"
                  value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})}
                  className="form-input"
                  style={{ resize: 'none' }}
                ></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary-sm">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="modal-overlay">
          <div className="glass modal-content">
            <h3 style={{ marginBottom: '24px' }}>Add Member to Project</h3>
            <form onSubmit={handleAddMember}>
              <div className="form-group">
                <label className="form-label">Select Member</label>
                <select 
                  required
                  value={memberEmail} onChange={e => setMemberEmail(e.target.value)}
                  className="form-input"
                  style={{ appearance: 'none' }}
                >
                  <option value="">Select a user...</option>
                  {allUsers.map(u => (
                    <option key={u._id} value={u.email}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddMemberModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary-sm">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
