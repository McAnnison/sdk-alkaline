import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/dashboard.css'; // Import the CSS file

const AdminDashboard = () => {
  const [stockData, setStockData] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stockResponse = await axios.get('/api/stocks');
        const notificationsResponse = await axios.get('/api/notifications');
        setStockData(stockResponse.data);
        setNotifications(notificationsResponse.data);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard-container">
      <h1>Admin Dashboard</h1>
      <h2>Stock Data</h2>
      <ul>
        {stockData.map((stock) => (
          <li key={stock.id}>
            <span>{stock.name}</span>
            <span>{stock.quantity}</span>
          </li>
        ))}
      </ul>
      <h2>Notifications</h2>
      <ul>
        {notifications.map((notification) => (
          <li key={notification.id}>
            <span>{notification.message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;