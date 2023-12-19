import React, { ReactNode } from 'react';
import Header from "../../components/header/Header";
import Footer from '../../components/footer/Footer';

type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <Header />
      <div className="mx-auto max-w-6xl">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;