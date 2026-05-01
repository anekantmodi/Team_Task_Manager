import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { CheckCircle2, Clock, AlertCircle, ListTodo } from 'lucide-react';

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
    { title: 'Total Tasks', value: stats.total, icon: <ListTodo size={24} color="#3b82f6" />, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
    { title: 'Completed', value: stats.completed, icon: <CheckCircle2 size={24} color="#10b981" />, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
    { title: 'In Progress', value: stats.inProgress, icon: <Clock size={24} color="#f59e0b" />, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
    { title: 'To Do', value: stats.pending, icon: <AlertCircle size={24} color="#a855f7" />, color: '#a855f7', bg: 'rgba(168, 85, 247, 0.1)' },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Dashboard Overview</h2>
          <p className="text-sm mt-1">Welcome back! Here's your progress.</p>
        </div>
      </div>

      <div className="dashboard-stats">
        {statCards.map((stat, index) => (
          <div key={index} className="glass stat-card" style={{ borderLeft: `4px solid ${stat.color}` }}>
            <div>
              <p className="text-sm font-medium text-muted">{stat.title}</p>
              <h3 className="stat-value">{stat.value}</h3>
            </div>
            <div className="stat-icon" style={{ background: stat.bg }}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '24px' }}>Recent Tasks</h3>
        {tasks.length === 0 ? (
          <div className="empty-state">No tasks found.</div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Task Name</th>
                  <th>Status</th>
                  <th>Due Date</th>
                </tr>
              </thead>
              <tbody>
                {tasks.slice(0, 5).map((task) => (
                  <tr key={task._id}>
                    <td className="font-medium text-main">{task.title}</td>
                    <td>
                      <span className={`status-badge status-${task.status.replace('-', '')}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="text-sm text-muted">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
