import React, { ReactNode } from 'react';
import './Layout.css';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';

type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <Header/>
        <div className='flex-container'>
          <div className='inner'>
            {children}
          </div>          
        </div>
      <Footer/>
    </div>
  );
};

export default Layout;