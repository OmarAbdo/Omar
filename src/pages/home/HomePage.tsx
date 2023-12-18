import React from 'react';

interface HomePageProps {
  title: string;
}

const HomePage: React.FC<HomePageProps> = ({ title }) => {
  return (
    <div>
      <h1>{title}</h1>
      <p>Welcome to the home page!</p>
    </div>
  );
};

export default HomePage;