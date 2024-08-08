import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Layout.css';

const Layout = () => {
  return (
    <div>
      <div className='navbar_container'>
        
          <Link to="/" className='r '><img className='home_icon' src='./../../public/trophy-red.png'></img></Link>
          <Link to="/assistant" className='r'><p>Assistant</p></Link>
          <Link to="/contact" className='r'><p>Contact</p></Link>
          <a
  href="https://github.com/vaibhav210603/TechPath-Scout/blob/main/Techpath_scout%20blueprint.pdf"
  target="_blank"
  rel="noopener noreferrer"
  className="r"
>
<p>Blueprint</p>
</a>
         


          
       
      </div>
      <div className='page-content'>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
