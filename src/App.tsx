import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./layouts/default/Layout";
import HomePage from "./pages/home/HomePage";
import ArticlesPage from "./pages/articles/ArticlesPage";
import ArticlePage from "./pages/articles/ArticlePage";
import CVPage from "./pages/cv/CVPage";
import ScrollToTop from "./utils/ScrollToTop";
import "./App.css";
import "./tailwind.css";

const App: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/articles/:slug" element={<ArticlePage />} />
          <Route path="/cv" element={<CVPage />} />
        </Routes>
      </Layout>
    </>
  );
};

export default App;
