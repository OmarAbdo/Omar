import React from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="bg-light-bg dark:bg-dark-bg min-h-screen transition-colors duration-300">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
