"use client";
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from 'react-router-dom';
import './styles/App.css';
import SignUp from './components/JoinUs';
import SignIn from './components/Auth/SingIn'; 
import StockForm from './components/Stock/stockForm';
import AdminDashboard from './components/Admin/AdminDash';
import HRDashboard from './components/HR/HRDashboard';
import FieldDash from './components/Field/FieldDash';
import FactorySuper from './components/Factory/FactorySuper';

const AuthPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'worker'
  });

  const roleRoutes = {
    worker: '/stock',
    admin: '/admin',
    supervisor: '/factory',
    field: '/field',
    hr: '/hr'
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const route = roleRoutes[formData.role];
    if (route) {
      navigate(route);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1>SDK Alkaline Water Co.</h1>
        <p className="subtitle">Change your water, Change your life!</p>
      </div>
      
      <div className="auth-card">
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="select-group">
            <label htmlFor="role">Choose role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="worker">Worker</option>
              <option value="admin">Admin</option>
              <option value="hr">HR</option>
              <option value="supervisor">Supervisor</option>
              <option value="field">Field Manager</option>
            </select>
          </div>

          <button type="submit" className="submit-btn">
            Sign In
            <div className="liquid"></div>
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/joinus" className="link">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          
          {/* Worker Routes */}
          <Route path="/worker/signin" element={<SignIn userType="worker" redirectPath="/stock" />} />
          
          {/* Admin Routes */}
          <Route path="/admin/signin" element={<SignIn userType="admin" redirectPath="/admin" />} />
          <Route path="/admin/signup" element={<SignUp userType="admin" redirectPath="/admin" />} />
          
          {/* Supervisor Routes */}
          <Route path="/supervisor/signin" element={<SignIn userType="supervisor" redirectPath="/factory" />} />
          <Route path="/supervisor/signup" element={<SignUp userType="supervisor" redirectPath="/factory" />} />
          
          {/* HR Routes */}
          <Route path="/hr/signin" element={<SignIn userType="hr" redirectPath="/hr" />} />
          <Route path="/hr/signup" element={<SignUp userType="hr" redirectPath="/hr" />} />
          
          {/* Field Manager Routes */}
          <Route path="/field/signin" element={<SignIn userType="field" redirectPath="/field" />} />
          <Route path="/field/signup" element={<SignUp userType="field" redirectPath="/field" />} />
          
          {/* Dashboard Routes */}
          <Route path="/hr" element={<HRDashboard />} />
          <Route path="/field" element={<FieldDash />} />
          <Route path="/factory" element={<FactorySuper />} />
          <Route path="/stock" element={<StockForm />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Router>
      
      <footer className="footer">
        &copy; {new Date().getFullYear()} SDK Alkaline Water Co. All rights reserved.
      </footer>
    </>
  );
};

export default App;