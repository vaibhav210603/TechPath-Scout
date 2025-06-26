import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Layout.css';

const Layout = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation(); // Get current location

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Determine the class based on the current path
  const pageContentClass = location.pathname === '/assistant' 
    ? 'page-content-full-width' 
    : 'page-content';

  return (
    <div>
      <div 
        className={`navbar_container ${isHovered ? 'hovered' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {!isHovered && <div className="hover-text">HOVER</div>}
       
        
        {/* Original navbar for desktop */}
        <div className={`navbar_links ${isMobileMenuOpen ? 'open' : ''}`}>
          <Link to="/" className='r' onClick={closeMobileMenu}><p>Home</p></Link>
          <Link to="/assistant" className='r' onClick={closeMobileMenu}><p>Assistant</p></Link>
          <Link to="/contact" className='r' onClick={closeMobileMenu}><p>Contact</p></Link>
          <a
            href="/Techpath_scout blueprint.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="r"
            onClick={closeMobileMenu}
          >
            <p>Blueprint</p>
          </a>
        </div>
      </div>
      <div className={pageContentClass}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;