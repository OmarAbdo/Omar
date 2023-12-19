import React from "react";

interface HomePageProps {
  title: string;
}

const HomePage: React.FC<HomePageProps> = ({ title }) => {
  return (
    <div>
      <h1 className="text-4xl font-bold leading-tight text-gray-900">
        {title}
      </h1>
      <p>Welcome to the home page!</p>
    </div>
  );
};

export default HomePage;
