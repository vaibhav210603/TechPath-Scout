import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Layout.css';

const Layout = () => {
  return (
    <div>
      <div className='navbar_container'>
        
          <Link to="/" className='r'>Home</Link>
          <Link to="/contact" className='r' >Contact</Link>
       
      </div>
      <div className='page-content'>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
