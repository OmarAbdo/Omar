import React from "react";
import Hero from "../../components/hero/Hero";
import Service from "../../components/service/Service";
import CT1 from "../../components/cta1/Cta1";
import CT2 from "../../components/cta2/Cta2";

const HomePage: React.FC = () => {
  return (
    <div>
      <Hero />
      <Service />
      <CT1 />
      <CT2 />
    </div>
  );
};

export default HomePage;
