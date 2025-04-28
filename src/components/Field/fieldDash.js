"use client";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/field.css';

function FieldDash() {
  const router = useNavigate();
  const [deliveries, setDeliveries] = useState([]);
  const [formData, setFormData] = useState({
    cartonsToDispatch: '',
    customerName: '',
    location: '',
    contact: '',
    hasComplaint: false,
    complaintDetails: '',
    actionTaken: '',
    deliveryStatus: 'pending',
    deliveryDate: new Date().toISOString().split('T')[0]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [todayDeliveries, setTodayDeliveries] = useState(0);
  const [todayCartons, setTodayCartons] = useState(0);
  const [activeTab, setActiveTab] = useState('newDelivery');
  const [searchTerm, setSearchTerm] = useState('');

  // Load deliveries from localStorage (replace with API call in production)
  useEffect(() => {
    const savedDeliveries = JSON.parse(localStorage.getItem('waterDeliveries')) || [];
    setDeliveries(savedDeliveries);
    
    // Calculate today's stats
    const today = new Date().toISOString().split('T')[0];
    const todayData = savedDeliveries.filter(d => d.deliveryDate === today);
    setTodayDeliveries(todayData.length);
    setTodayCartons(todayData.reduce((sum, d) => sum + parseInt(d.cartonsToDispatch || 0), 0));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Validate form data
      if (!formData.cartonsToDispatch || !formData.customerName || !formData.location) {
        throw new Error('Please fill in all required fields');
      }

      if (formData.hasComplaint && !formData.actionTaken) {
        throw new Error('Please specify action taken for the complaint');
      }

      // Create new delivery record
      const newDelivery = {
        ...formData,
        id: Date.now().toString(),
        recordedAt: new Date().toISOString()
      };

      // Update state and localStorage (replace with API call in production)
      const updatedDeliveries = [...deliveries, newDelivery];
      setDeliveries(updatedDeliveries);
      localStorage.setItem('waterDeliveries', JSON.stringify(updatedDeliveries));

      // Update today's stats
      const today = new Date().toISOString().split('T')[0];
      if (newDelivery.deliveryDate === today) {
        setTodayDeliveries(prev => prev + 1);
        setTodayCartons(prev => prev + parseInt(newDelivery.cartonsToDispatch));
      }

      // Reset form
      setFormData({
        cartonsToDispatch: '',
        customerName: '',
        location: '',
        contact: '',
        hasComplaint: false,
        complaintDetails: '',
        actionTaken: '',
        deliveryStatus: 'pending',
        deliveryDate: new Date().toISOString().split('T')[0]
      });

      setSuccess('Delivery recorded successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredDeliveries = deliveries.filter(delivery => {
    const searchLower = searchTerm.toLowerCase();
    return (
      delivery.customerName.toLowerCase().includes(searchLower) ||
      delivery.location.toLowerCase().includes(searchLower) ||
      delivery.contact.toLowerCase().includes(searchLower)
    );
  });

  const updateDeliveryStatus = (id, status) => {
    const updatedDeliveries = deliveries.map(delivery => 
      delivery.id === id ? { ...delivery, deliveryStatus: status } : delivery
    );
    setDeliveries(updatedDeliveries);
    localStorage.setItem('waterDeliveries', JSON.stringify(updatedDeliveries));
  };

  return (
    <div className="field-manager-container">
      <header className="dashboard-header">
        <h1>Field Manager Dashboard</h1>
        <div className="stats-container">
          <div className="stat-card">
            <h3>Today's Deliveries</h3>
            <p>{todayDeliveries}</p>
          </div>
          <div className="stat-card">
            <h3>Today's Cartons</h3>
            <p>{todayCartons}</p>
          </div>
        </div>
      </header>

      <nav className="tabs">
        <button 
          className={activeTab === 'newDelivery' ? 'active' : ''}
          onClick={() => setActiveTab('newDelivery')}
        >
          New Delivery
        </button>
        <button 
          className={activeTab === 'deliveryHistory' ? 'active' : ''}
          onClick={() => setActiveTab('deliveryHistory')}
        >
          Delivery History
        </button>
        <button 
          className={activeTab === 'customerMap' ? 'active' : ''}
          onClick={() => setActiveTab('customerMap')}
        >
          Customer Map
        </button>
      </nav>

      {activeTab === 'newDelivery' && (
        <div className="form-section">
          <h2>Record New Delivery</h2>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <form onSubmit={handleSubmit} className="delivery-form">
            <div className="form-group">
              <label>Delivery Date</label>
              <input
                type="date"
                name="deliveryDate"
                value={formData.deliveryDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Number of Cartons to Dispatch *</label>
              <input
                type="number"
                name="cartonsToDispatch"
                value={formData.cartonsToDispatch}
                onChange={handleChange}
                required
                min="1"
              />
            </div>

            <div className="form-group">
              <label>Customer Name *</label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Contact Number</label>
              <input
                type="tel"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
              />
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="hasComplaint"
                  checked={formData.hasComplaint}
                  onChange={handleChange}
                />
                Customer has complaint?
              </label>
            </div>

            {formData.hasComplaint && (
              <>
                <div className="form-group">
                  <label>Complaint Details</label>
                  <textarea
                    name="complaintDetails"
                    value={formData.complaintDetails}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Action Taken *</label>
                  <textarea
                    name="actionTaken"
                    value={formData.actionTaken}
                    onChange={handleChange}
                    required={formData.hasComplaint}
                  />
                </div>
              </>
            )}

            <div className="form-actions">
              <button 
                type="submit" 
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Delivery'}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'deliveryHistory' && (
        <div className="history-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search deliveries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="deliveries-table">
            {filteredDeliveries.length === 0 ? (
              <p>No delivery records found</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Location</th>
                    <th>Cartons</th>
                    <th>Status</th>
                    <th>Complaint</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDeliveries.map(delivery => (
                    <tr key={delivery.id}>
                      <td>{new Date(delivery.deliveryDate).toLocaleDateString()}</td>
                      <td>{delivery.customerName}</td>
                      <td>{delivery.location}</td>
                      <td>{delivery.cartonsToDispatch}</td>
                      <td>
                        <select
                          value={delivery.deliveryStatus}
                          onChange={(e) => updateDeliveryStatus(delivery.id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td>{delivery.hasComplaint ? 'Yes' : 'No'}</td>
                      <td>
                        <button 
                          className="details-button"
                          onClick={() => router.push(`/delivery/${delivery.id}`)}
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {activeTab === 'customerMap' && (
        <div className="map-section">
          <h2>Customer Locations</h2>
          <div className="map-placeholder">
            <p>Map integration would display here showing customer locations</p>
            <p>Features would include:</p>
            <ul>
              <li>Interactive map with customer markers</li>
              <li>Route optimization for deliveries</li>
              <li>Delivery status indicators</li>
              <li>Clickable markers for details</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default FieldDash;