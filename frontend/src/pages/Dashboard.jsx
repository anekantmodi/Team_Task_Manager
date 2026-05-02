import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { CheckCircle2, Clock, AlertCircle, ListTodo, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, inProgress: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/tasks');
        const tasksData = res.data.data;
        setTasks(tasksData);

        setStats({
          total: tasksData.length,
          completed: tasksData.filter(t => t.status === 'completed').length,
          pending: tasksData.filter(t => t.status === 'todo').length,
          inProgress: tasksData.filter(t => t.status === 'in-progress').length,
        });
      } catch (error) {
        console.error("Error fetching tasks", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="text-muted">Loading dashboard...</div>;

  const statCards = [
    { title: 'Total Tasks', value: stats.total, icon: <ListTodo size={24} color="#D4D4D8" />, color: '#D4D4D8', bg: 'rgba(212, 212, 216, 0.1)' },
    { title: 'Completed', value: stats.completed, icon: <CheckCircle2 size={24} color="#10b981" />, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
    { title: 'In Progress', value: stats.inProgress, icon: <Clock size={24} color="#f59e0b" />, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
    { title: 'To Do', value: stats.pending, icon: <AlertCircle size={24} color="#a1a1aa" />, color: '#a1a1aa', bg: 'rgba(161, 161, 170, 0.1)' },
  ];

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
    <motion.div 
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="page-header">
        <div>
          <h2>Dashboard Overview</h2>
          <p className="text-sm mt-1">Welcome back! Here's your progress.</p>
        </div>
      </motion.div>

      <div className="bento-grid">
        {/* Main large stat card (Bento Col 12 or 8) */}
        <motion.div 
          variants={itemVariants}
          className="premium-glass bento-item bento-col-12"
          style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}
        >
          <div style={{ position: 'absolute', top: '-50%', right: '-10%', width: '300px', height: '300px', background: 'rgba(212, 212, 216, 0.15)', filter: 'blur(60px)', borderRadius: '50%' }}></div>
          <div className="flex items-center gap-4 mb-4">
            <div className="list-item-icon" style={{ background: 'rgba(212, 212, 216, 0.2)', color: '#D4D4D8' }}>
              <Activity size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '24px' }}>Productivity Pulse</h3>
              <p className="text-muted">You have completed {stats.completed} out of {stats.total} tasks.</p>
            </div>
          </div>
          <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden', marginTop: '16px' }}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              style={{ height: '100%', background: 'linear-gradient(90deg, #D4D4D8, #F4F4F5)', borderRadius: '4px' }}
            />
          </div>
        </motion.div>

        {/* 4 smaller stat cards in bento grid */}
        {statCards.map((stat, index) => (
          <motion.div 
            key={index} 
            variants={itemVariants}
            whileHover={{ y: -4, scale: 1.02 }}
            className="premium-glass bento-item bento-col-3" 
            style={{ padding: '24px', borderTop: `2px solid ${stat.color}` }}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted">{stat.title}</p>
                <h3 className="stat-value" style={{ fontSize: '36px', marginTop: '8px' }}>{stat.value}</h3>
              </div>
              <div className="stat-icon" style={{ background: stat.bg }}>
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Horizontal List for Recent Tasks replacing the old table */}
        <motion.div 
          variants={itemVariants}
          className="premium-glass bento-item bento-col-12"
          style={{ padding: '24px' }}
        >
          <h3 style={{ marginBottom: '24px' }}>Recent Tasks</h3>
          {tasks.length === 0 ? (
            <div className="empty-state">No tasks found.</div>
          ) : (
            <div className="horizontal-list">
              {tasks.slice(0, 5).map((task) => (
                <motion.div 
                  key={task._id}
                  whileHover={{ scale: 1.01 }}
                  className="horizontal-list-item"
                >
                  <div className="list-item-main">
                    <div className="list-item-icon">
                      <ListTodo size={20} color={task.status === 'completed' ? '#10b981' : '#D4D4D8'} />
                    </div>
                    <div>
                      <h4 className="font-medium text-main" style={{ fontSize: '15px' }}>{task.title}</h4>
                      <p className="text-xs text-muted mt-1">
                        Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                      </p>
                    </div>
                  </div>
                  <div className="list-item-meta">
                    <span className={`status-badge status-${task.status.replace('-', '')}`}>
                      {task.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
