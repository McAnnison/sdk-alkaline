"use client";
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from 'react-router-dom';
import './styles/App.css';
import SignIn from './components/Auth/SignIn';
import SignUp from './components/Auth/SignUp';
import StockForm from './components/Stock/stockForm';
import AdminDashboard from './components/Admin/AdminDash';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    
    if (formData.role === 'worker') {
      navigate('/stock');
    } else if (formData.role === 'admin') {
      navigate('/admin');
    }
  };

  return (
   
    <div className="auth-container">
       <div className="auth-header">
          <h1>SDK Alkaline Water Co.</h1>
          <p className="subtitle">Pure hydration experience</p>
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

          <div className="input-group">
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <label>Confirm Password</label>
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
            </select>
          </div>

          <button type="submit" className="submit-btn">
            Sign up
            <div className="liquid"></div>
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/signin" className="link">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/worker/signin" element={<SignIn userType="worker" redirectPath="/stock" />} />
        <Route path="/admin/signup" element={<SignUp userType="admin" redirectPath="/admin" />} />
        <Route path="/stock" element={<StockForm />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
      <footer className="footer">
        &copy; {new Date().getFullYear()} StockFlow. All rights reserved.
      </footer>
    </Router>
  );
}

export default App;