// App.tsx
import React from "react";
import Layout from "./layouts/default/Layout";
import HomePage from "./pages/home/HomePage";
import "./App.css";
import "./tailwind.css";
import { DarkModeProvider } from "./DarkModeContext";

const App: React.FC = () => {
  return (
    <DarkModeProvider>
      <Layout>
        <HomePage />
      </Layout>
    </DarkModeProvider>
  );
};

export default App;
