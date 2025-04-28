"use client";
import React, { useState, useEffect } from 'react';
import '../../styles/factory.css';

function FactorySuper() {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    filterAvailable: false,
    waterAvailable: false,
    maintenanceNeeded: false,
    maintenanceDetails: '',
    selectedWorkers: [],
    productionNotes: '',
    qualityCheck: 'pending'
  });
  const [workers, setWorkers] = useState([]);
  const [dailyReports, setDailyReports] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('dailyReport');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch workers from backend
  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        // Replace with actual API call
        const response = await fetch('/api/workers');
        const data = await response.json();
        setWorkers(data);
      } catch (err) {
        console.error('Failed to fetch workers:', err);
      }
    };

    fetchWorkers();
    
    // Load existing reports from localStorage (replace with API in production)
    const savedReports = JSON.parse(localStorage.getItem('supervisorReports')) || [];
    setDailyReports(savedReports);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleWorkerSelect = (workerId) => {
    setFormData(prev => {
      const newSelected = prev.selectedWorkers.includes(workerId)
        ? prev.selectedWorkers.filter(id => id !== workerId)
        : [...prev.selectedWorkers, workerId];
      return { ...prev, selectedWorkers: newSelected };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Validate form
      if (!formData.date) {
        throw new Error('Date is required');
      }

      // Create report object
      const report = {
        ...formData,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        presentWorkers: workers.filter(w => formData.selectedWorkers.includes(w.id))
      };

      // Save to "backend" (localStorage for demo)
      const updatedReports = [...dailyReports, report];
      setDailyReports(updatedReports);
      localStorage.setItem('supervisorReports', JSON.stringify(updatedReports));

      // Reset form (keep date)
      setFormData(prev => ({
        date: new Date().toISOString().split('T')[0],
        filterAvailable: false,
        waterAvailable: false,
        maintenanceNeeded: false,
        maintenanceDetails: '',
        selectedWorkers: [],
        productionNotes: '',
        qualityCheck: 'pending'
      }));

      setSuccess('Daily report submitted successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredReports = dailyReports.filter(report => {
    const searchLower = searchTerm.toLowerCase();
    return (
      report.date.includes(searchLower) ||
      report.productionNotes.toLowerCase().includes(searchLower) ||
      report.qualityCheck.toLowerCase().includes(searchLower)
    );
  });

  const getWorkerAttendancePercentage = () => {
    if (dailyReports.length === 0) return 0;
    const presentDays = workers.map(worker => {
      return dailyReports.filter(report => 
        report.selectedWorkers.includes(worker.id)
      ).length;
    });
    const totalPossible = workers.length * dailyReports.length;
    const totalPresent = presentDays.reduce((sum, days) => sum + days, 0);
    return Math.round((totalPresent / totalPossible) * 100);
  };

  return (
    <div className="supervisor-container">
      <header className="dashboard-header">
        <h1>Factory Supervisor Dashboard</h1>
        <div className="stats-container">
          <div className="stat-card">
            <h3>Total Workers</h3>
            <p>{workers.length}</p>
          </div>
          <div className="stat-card">
            <h3>Attendance Rate</h3>
            <p>{getWorkerAttendancePercentage()}%</p>
          </div>
          <div className="stat-card">
            <h3>Reports Submitted</h3>
            <p>{dailyReports.length}</p>
          </div>
        </div>
      </header>

      <nav className="tabs">
        <button 
          className={activeTab === 'dailyReport' ? 'active' : ''}
          onClick={() => setActiveTab('dailyReport')}
        >
          Daily Report
        </button>
        <button 
          className={activeTab === 'reportsHistory' ? 'active' : ''}
          onClick={() => setActiveTab('reportsHistory')}
        >
          Reports History
        </button>
        <button 
          className={activeTab === 'workerManagement' ? 'active' : ''}
          onClick={() => setActiveTab('workerManagement')}
        >
          Worker Management
        </button>
      </nav>

      {activeTab === 'dailyReport' && (
        <div className="form-section">
          <h2>Daily Factory Report</h2>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <form onSubmit={handleSubmit} className="report-form">
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="checkbox-group">
              <h3>Factory Status</h3>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="filterAvailable"
                  checked={formData.filterAvailable}
                  onChange={handleChange}
                />
                Filter Available
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="waterAvailable"
                  checked={formData.waterAvailable}
                  onChange={handleChange}
                />
                Water Available
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="maintenanceNeeded"
                  checked={formData.maintenanceNeeded}
                  onChange={handleChange}
                />
                Maintenance Needed
              </label>
            </div>

            {formData.maintenanceNeeded && (
              <div className="form-group">
                <label>Maintenance Details</label>
                <textarea
                  name="maintenanceDetails"
                  value={formData.maintenanceDetails}
                  onChange={handleChange}
                  placeholder="Describe maintenance requirements..."
                />
              </div>
            )}

            <div className="form-group">
              <h3>Workers Present Today</h3>
              <div className="workers-grid">
                {workers.map(worker => (
                  <label key={worker.id} className="worker-checkbox">
                    <input
                      type="checkbox"
                      checked={formData.selectedWorkers.includes(worker.id)}
                      onChange={() => handleWorkerSelect(worker.id)}
                    />
                    <div className="worker-info">
                      <span className="worker-name">{worker.name}</span>
                      <span className="worker-role">{worker.role}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Production Notes</label>
              <textarea
                name="productionNotes"
                value={formData.productionNotes}
                onChange={handleChange}
                placeholder="Any notes about today's production..."
              />
            </div>

            <div className="form-group">
              <label>Quality Check Status</label>
              <select
                name="qualityCheck"
                value={formData.qualityCheck}
                onChange={handleChange}
              >
                <option value="pending">Pending</option>
                <option value="passed">Passed</option>
                <option value="failed">Failed</option>
                <option value="partial">Partial Pass</option>
              </select>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'reportsHistory' && (
        <div className="history-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="reports-table">
            {filteredReports.length === 0 ? (
              <p>No reports found</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Workers Present</th>
                    <th>Filter</th>
                    <th>Water</th>
                    <th>Maintenance</th>
                    <th>Quality Check</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map(report => (
                    <tr key={report.id}>
                      <td>{report.date}</td>
                      <td>{report.selectedWorkers.length}/{workers.length}</td>
                      <td>{report.filterAvailable ? '✅' : '❌'}</td>
                      <td>{report.waterAvailable ? '✅' : '❌'}</td>
                      <td>{report.maintenanceNeeded ? '⚠️' : '✅'}</td>
                      <td>
                        <span className={`status-${report.qualityCheck}`}>
                          {report.qualityCheck}
                        </span>
                      </td>
                      <td>
                        <button className="view-button">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {activeTab === 'workerManagement' && (
        <div className="worker-section">
          <h2>Worker Management</h2>
          <div className="worker-list">
            {workers.length === 0 ? (
              <p>No workers found</p>
            ) : (
              workers.map(worker => (
                <div key={worker.id} className="worker-card">
                  <div className="worker-avatar">
                    {worker.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="worker-details">
                    <h3>{worker.name}</h3>
                    <p>{worker.role}</p>
                    <p>ID: {worker.id}</p>
                    <p>Last Active: {worker.lastActive || 'Unknown'}</p>
                  </div>
                  <div className="worker-actions">
                    <button className="action-button">Edit</button>
                    <button className="action-button">Schedule</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default FactorySuper;