"use client";
import React, { useState, useEffect } from 'react';
import '../../styles/stock.css';

function StockForm() {
  const [formData, setFormData] = useState({
    openingStock: '',
    todaysProduction: '',
    totalInStock: '',
    dispatch: '',
    closingStock: '',
    waterLevel: ''
  });
  const [labelsLeftImage, setLabelsLeftImage] = useState(null);
  const [shrinkWrapImage, setShrinkWrapImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Calculate totals whenever openingStock, todaysProduction, or dispatch changes
  useEffect(() => {
    const opening = parseFloat(formData.openingStock) || 0;
    const production = parseFloat(formData.todaysProduction) || 0;
    const dispatch = parseFloat(formData.dispatch) || 0;
    
    const total = opening + production;
    const closing = total - dispatch;
    
    setFormData(prev => ({
      ...prev,
      totalInStock: total > 0 ? total.toString() : '',
      closingStock: closing > 0 ? closing.toString() : ''
    }));
  }, [formData.openingStock, formData.todaysProduction, formData.dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e, setImage) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      const formDataToSend = new FormData();
      
      // Append all form data
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      
      // Append images if they exist
      if (labelsLeftImage) {
        formDataToSend.append('labelsLeftImage', labelsLeftImage);
      }
      if (shrinkWrapImage) {
        formDataToSend.append('shrinkWrapImage', shrinkWrapImage);
      }
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/stock', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit stock data');
      }
      
      await response.json();
      setSuccess('Stock data saved successfully!');
      // Reset form
      setFormData({
        openingStock: '',
        todaysProduction: '',
        totalInStock: '',
        dispatch: '',
        closingStock: '',
        waterLevel: ''
      });
      setLabelsLeftImage(null);
      setShrinkWrapImage(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className='text'>
        <h1 className="stock-management-header">Stock Management</h1>
      </div>
      
      <div className="stock-management-container"> 
        <form onSubmit={handleSubmit} className="stock-management-form">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <section className="form-section">
            <div className="form-group">
              <label>Opening Stock</label>
              <input
                type="number"
                name="openingStock"
                value={formData.openingStock}
                onChange={handleChange}
                required
                min="0"
              />
              <label>Today's Production</label>
              <input
                type="number"
                name="todaysProduction"
                value={formData.todaysProduction}
                onChange={handleChange}
                required
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Total in stock (auto-calculated)</label>
              <input
                type="number"
                name="totalInStock"
                value={formData.totalInStock}
                readOnly
                className="read-only-input"
              />
            </div>

            <div className="form-group">
              <label>Dispatch</label>
              <input
                type="number"
                name="dispatch"
                value={formData.dispatch}
                onChange={handleChange}
                required
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Closing stock (auto-calculated)</label>
              <input
                type="number"
                name="closingStock"
                value={formData.closingStock}
                readOnly
                className="read-only-input"
              />
            </div>

            <div className="form-group">
              <label>Water Level</label>
              <input
                type="number"
                name="waterLevel"
                value={formData.waterLevel}
                onChange={handleChange}
                required
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Labels Left</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, setLabelsLeftImage)}
              />
            </div>

            <div className="form-group">
              <label>Shrink wrap left</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, setShrinkWrapImage)}
              />
            </div>
          </section>

          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Stock Data'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
export default StockForm;