// Header.tsx

import React, { useState } from "react";
import "./Header.css";

const Header: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <header className={`header ${isCollapsed ? "collapsed" : ""}`}>
      <div className="logo">Your Logo</div>
      <nav className={`nav ${isCollapsed ? "collapsed" : ""}`}>
        <a href="#">Link 1</a>
        <a href="#">Link 2</a>
        <a href="#">Link 3</a>
      </nav>
      <div className="hamburger" onClick={toggleCollapse}>
        <span className={`line ${isCollapsed ? "line-1" : ""}`} />
        <span className={`line ${isCollapsed ? "line-2" : ""}`} />
        <span className={`line ${isCollapsed ? "line-3" : ""}`} />
      </div>
    </header>
  );
};

export default Header;
