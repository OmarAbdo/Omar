import React from 'react';
import Layout from './layouts/default/Layout';
import HomePage from './pages/home/HomePage';
import './App.css';
import './tailwind.css';


const App: React.FC = () => {
  return (
    <Layout>
      <HomePage title="Omar Abdou"/>
    </Layout>
  );
};

export default App;