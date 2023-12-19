import React from 'react';
import Layout from './layouts/default/Layout';
import HomePage from './pages/home/HomePage';
import './App.css';
import './tailwind.css';


const App: React.FC = () => {
  return (
    <Layout>
      <HomePage />
    </Layout>
  );
};

export default App;