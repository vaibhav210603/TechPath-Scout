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
          <Link to="/assistant" className='r'>Assistant</Link>
          <Link to="/assistant" className='r'>Contact</Link>
          <Link to="/assistant" className='r'>Blueprint</Link>
         
          <Link to="/signin" className='r signin'>SignIn</Link>

          
       
      </div>
      <div className='page-content'>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
