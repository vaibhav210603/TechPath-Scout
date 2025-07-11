import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import './Layout.css';

const Layout = () => {
  return (
    <>
      <Link to="/" className="fixed-home-btn">Home</Link>
      <div className="page-content">
        <Outlet />
      </div>
    </>
  );
};

export default Layout;