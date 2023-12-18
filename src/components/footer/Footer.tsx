import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer flex-container">
      <div className="">
        <div className="left">Top Content</div>
        <div className="right">Bottom Content</div>
      </div>
    </footer>
  );
};

export default Footer;