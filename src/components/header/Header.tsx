import React from 'react';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header flex-container flex-align-items-stretch">
      <nav className="nav">
        <div className="logo">Logo</div>
        <ul className="menu">
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;