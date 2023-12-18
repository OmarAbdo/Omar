import React from "react";

interface HomePageProps {
  title: string;
}

const HomePage: React.FC<HomePageProps> = ({ title }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold underline text-red-600">{title}</h1>
      <p>Welcome to the home page!</p>
      <div className="text-cyan-100">
        This is a component with Tailwind CSS styling.
      </div>
    </div>
  );
};

export default HomePage;
