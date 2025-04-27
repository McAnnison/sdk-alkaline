"use client";
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from 'react-router-dom';
import './signin.css'; 
import SignUp from './SignUp'; 
import StockForm from '../Stock/stockForm'; 
import AdminDashboard from '../Admin/AdminDash'; 
import HRDashboard from '../HR/HRDashboard'; 
import FactorySupervisor from '../Factory/factorySuper'; 

function AuthPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'worker'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => { // Added missing handleSubmit function
    e.preventDefault();
    
    if (formData.role === 'worker') {
      navigate('/stock');
    } else if (formData.role === 'admin') {
      navigate('/admin');
    } else if (formData.role === 'supervisor') {
      navigate('/factory');
    } else if (formData.role === 'field') {
      navigate('/field');
    } else if (formData.role === 'hr') {
      navigate('/hr');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1>SDK Alkaline Water Co.</h1>
        <p className="subtitle">Change your water, Change your life!</p>
      </div>
      <div className="auth-card">
        <div className="water-wave"></div>      
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <label>Name</label>
          </div>

          <div className="input-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label>Email</label>
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <label>Password</label>
          </div>

          <div className="select-group">
            <label>Choose role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="worker">Worker</option>
              <option value="admin">Admin</option>
              <option value="hr">HR</option>
              <option value="supervisor">Supervisor</option>
              <option value="field">Field Manager</option> {/* Fixed typo from 'filed' to 'field' */}
            </select>
          </div>

          <button type="submit" className="submit-btn">
            Sign in
            <div className="liquid"></div>
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/signup" className="link">Sign up</Link></p> {/* Fixed typo in "Don't" */}
        </div>
      </div>
    </div>
  );
}

function SignIn() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/worker/signin" element={<AuthPage userType="worker" />} />
        <Route path="/admin/signup" element={<SignUp userType="admin" redirectPath="/admin" />} />
        <Route path="/supervisor/signin" element={<AuthPage userType="supervisor" />} />
        <Route path="/hr/signup" element={<SignUp userType='hr' redirectPath="/hr" />} />
        <Route path='/hr' element={<HRDashboard />} />
        <Route path='/factory' element={<FactorySupervisor />} /> {/* Fixed component name */}
        <Route path="/stock" element={<StockForm />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default SignIn;