import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Plus, Users, FolderKanban } from 'lucide-react';
import { motion } from 'framer-motion';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div initial="hidden" animate="show" variants={containerVariants}>
      <motion.div variants={itemVariants} className="page-header">
        <div>
          <h2>Projects</h2>
          <p className="text-sm mt-1">Manage your team's projects</p>
        </div>
        {user?.role === 'admin' && (
          <motion.button 
            whileHover={{ scale: 0.98 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="btn-primary-sm flex items-center gap-2"
          >
            <Plus size={18} /> New Project
          </motion.button>
        )}
      </motion.div>

      <div className="bento-grid">
        {projects.map((project) => (
          <motion.div 
            key={project._id} 
            variants={itemVariants}
            whileHover={{ y: -4, scale: 1.02 }}
            className="premium-glass bento-item bento-col-4 card"
            style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
          >
            <div className="project-header">
              <div className="project-icon" style={{ background: 'rgba(212, 212, 216, 0.1)', color: '#D4D4D8' }}>
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
            <p className="project-desc" style={{ flex: 1 }}>{project.description}</p>
            
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
          </motion.div>
        ))}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="modal-overlay"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="premium-glass modal-content"
          >
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
          </motion.div>
        </motion.div>
      )}

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="modal-overlay"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="premium-glass modal-content"
          >
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
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Projects;
