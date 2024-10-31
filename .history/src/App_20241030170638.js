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

