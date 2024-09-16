import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Layout.css';

const Layout = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div>
      <div 
        className={`navbar_container ${isHovered ? 'hovered' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {!isHovered && <div className="hover-text">HOVER</div>}
        {/* Dropdown for mobile */}
        <button className='dropdown_icon' onClick={toggleMobileMenu}>
          ☰
        </button>
        {/* Original navbar for desktop */}
        <div className={`navbar_links ${isMobileMenuOpen ? 'open' : ''}`}>
          <Link to="/" className='r' onClick={closeMobileMenu}><p>Home</p></Link>
          <Link to="/assistant" className='r' onClick={closeMobileMenu}><p>Assistant</p></Link>
          <Link to="/contact" className='r' onClick={closeMobileMenu}><p>Contact</p></Link>
          <a
            href="https://github.com/vaibhav210603/TechPath-Scout/blob/main/Techpath_scout%20blueprint.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="r"
            onClick={closeMobileMenu}
          >
            <p>Blueprint</p>
          </a>
        </div>
      </div>
      <div className='page-content'>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;