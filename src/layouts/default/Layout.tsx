// Layout.tsx
import React from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { useDarkMode } from "../../DarkModeContext"; // adjust the import path

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { darkMode } = useDarkMode();

  return (
    <div
      className={`mx-auto max-w-8xl px-4 sm:px-6 lg:px-8 ${
        darkMode ? "dark" : ""
      }`}
    >
      <Header />
      <div className={`mx-auto max-w-7xl ${darkMode ? 'dark' : ''}`}>
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
