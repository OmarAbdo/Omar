import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./layouts/default/Layout";
import HomePage from "./pages/home/HomePage";
import ArticlesPage from "./pages/articles/ArticlesPage";
import ArticlePage from "./pages/articles/ArticlePage";
import CVPage from "./pages/cv/CVPage";
import ScrollToTop from "./utils/ScrollToTop";

// Prototype pages
import PulsePage from "./pages/prototypes/pulse/PulsePage";
import VaultPage from "./pages/prototypes/vault/VaultPage";
import ArrowPage from "./pages/prototypes/arrow/ArrowPage";
import LumaPage from "./pages/prototypes/luma/LumaPage";
import HavenPage from "./pages/prototypes/haven/HavenPage";
import SafiPage from "./pages/prototypes/safi/SafiPage";

import "./App.css";
import "./tailwind.css";

const App: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Standalone prototype routes — no Layout wrapper */}
        <Route path="/prototypes/pulse" element={<PulsePage />} />
        <Route path="/prototypes/vault" element={<VaultPage />} />
        <Route path="/prototypes/arrow" element={<ArrowPage />} />
        <Route path="/prototypes/luma" element={<LumaPage />} />
        <Route path="/prototypes/haven" element={<HavenPage />} />
        <Route path="/prototypes/safi" element={<SafiPage />} />

        {/* Main site routes — with Layout */}
        <Route
          path="/"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />
        <Route
          path="/articles"
          element={
            <Layout>
              <ArticlesPage />
            </Layout>
          }
        />
        <Route
          path="/articles/:slug"
          element={
            <Layout>
              <ArticlePage />
            </Layout>
          }
        />
        <Route
          path="/cv"
          element={
            <Layout>
              <CVPage />
            </Layout>
          }
        />
      </Routes>
    </>
  );
};

export default App;
