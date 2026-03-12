import React from "react";
import Hero from "../../components/hero/Hero";
import Projects from "../../components/projects/Projects";
import Service from "../../components/service/Service";
import About from "../../components/about/About";
import Experience from "../../components/experience/Experience";
import Contact from "../../components/contact/Contact";

const HomePage: React.FC = () => {
  return (
    <div>
      <Hero />
      <Projects />
      <Service />
      <About />
      <Experience />
      <Contact />
    </div>
  );
};

export default HomePage;
