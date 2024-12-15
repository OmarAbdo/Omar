import React from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { useTheme } from "../../utils/ThemeContext";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme } = useTheme();

  return (
    <div className={`mx-auto max-w-8xl px-4 sm:px-6 lg:px-8 ${theme}`}>
      <Header />
      <div className="mx-auto max-w-7xl">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
