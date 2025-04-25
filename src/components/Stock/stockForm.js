"use client";
import React, { useState } from 'react';
import '../../styles/stock.css'

function StockForm() {
  const [formData, setFormData] = useState({
    openingStock: '',
    todaysProduction: '',
    totalInStock: '',
    dispatch: '',
    closingStock: '',
    waterLevel: '',
    selectedImage1: null,
    selectedImage2: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e, fieldName) => {
    setFormData(prev => ({ ...prev, [fieldName]: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add form submission logic here
  };

  return (
<>
    <div className='text'>
    <h1 className="stock-management-header">Stock Management</h1>
    </div>
    
    <div className="stock-management-container"> 
      <form onSubmit={handleSubmit} className="stock-management-form">
        <section className="form-section">
        
          
          <div className="form-group">
            <label>Opening Stock</label>
            <input
              type="number"
              name="openingStock"
              value={formData.openingStock}
              onChange={handleChange}
            />
            <label>Todays Production</label>
            <input
              type="number"
              name="todaysProduction"
              value={formData.todaysProduction}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Total in stock</label>
            <input
              type="number"
              name="totalInStock"
              value={formData.totalInStock}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Dispatch</label>
            <input
              type="number"
              name="dispatch"
              value={formData.dispatch}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Closing stock</label>
            <input
              type="number"
              name="closingStock"
              value={formData.closingStock}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Water Level</label>
            <input
              type="number"
              name="waterLevel"
              value={formData.waterLevel}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Labels Left</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, 'selectedImage1')}
            />
          </div>

          <div className="form-group">
            <label>Shrink wrap left</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, 'selectedImage2')}
            />
          </div>
        </section>

        <div className="form-actions">
          <button type="submit" className="submit-button">
            Save Stock Data
          </button>
        </div>
      </form>
    </div></>
  );
}

export default StockForm;