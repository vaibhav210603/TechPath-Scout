import React from 'react';
import './contact.css';

function Contact() {
  return (
    <div className="contact-wrapper">
      <div className="contact-header">
        <img src="/mephotocropped.jpeg" alt="Vaibhav Upadhyay" className="contact-photo" />
       
      </div>
      <div className="contact-card">
        <h3 className="contact-name">Vaibhav Upadhyay</h3>
        <p className="contact-details">Email: <a href="mailto:vaibhav210603@gmail.com">vaibhav210603@gmail.com</a></p>
        <p className="contact-details">Phone: +91-8175966910</p>
        <div className="contact-links">
          <a href="https://www.linkedin.com/in/vaibhavupadhyay21" target="_blank" rel="noopener noreferrer">
            <img src="linkedin.png" alt="LinkedIn" className="contact-icon" />
          </a>
          <a href="https://github.com/vaibhav210603" target="_blank" rel="noopener noreferrer">
            <img src="github.png" alt="GitHub" className="contact-icon" />
          </a>
        </div>
      </div>
      <div className="contact-skills">
        <h4>Skills:</h4>
        <ul>
          <li>C/C++</li>
          <li>React</li>
          <li>Node/Express.js</li>
          <li>DBMS</li>
          <li>Embedded systems</li>
          <li>Lean Six Sigma/ Agile</li>
        </ul>
      </div>
      <h2 className="contact-title">Let's Connect!</h2>
        <p className="contact-subtitle">"Full stack MERN developer with a passion for expanding beyond web development."</p>
    </div>
  );
}

export default Contact;
