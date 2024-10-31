import React from 'react';
import Layout from './components/Layout';
import { BrowserRouter as Router } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <Layout />
    </Router>
  );
};

export default App;

# File: src/components/Layout.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import EnergyDashboard from '../pages/EnergyDashboard';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Routes>
          <Route path="/" element={<EnergyDashboard />} />
        </Routes>
      </div>
    </div>
  );
};

export default Layout;