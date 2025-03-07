import React, { useState, useRef } from 'react';
import TextBlock from '../../../constants/TextBlock';
import { Link } from "react-router-dom";

import Feature from './Feature';
import './Hero.css'
import ReviewSection from './ReviewSection'


export default function Hero() {


   
    return (
        <div className="hero-container">
           
            <div className="top-banner">
                <p>TechPath Scout</p>
            </div>

            {/* Middle TextBlock */}
            <div className="text-block">

                <div className="text">
                    <h1 className='heading_text'><span className='red'>97%</span> of coders are clueless! </h1>
                Now's the time -- "OWN" your future<br></br><br></br>
                80% coders are regretting their decisions so make sure you select wisely and "not" follow others blindly when it comes to your career<br></br>
                Don't know what to pick?----AI/ML | Data Science | Web Dev | Cybersecurity | Game Dev <br></br><br></br>
                We will help you find your ideal domain of excellence so that you can get ahead of 99% coders<br></br>
                <br></br>But first do you "want to" help yourself?
                </div>

                <div className="graphix">
                <img src='/coder_confusednw.png'></img>
                </div>
      
            </div>

            {/* Students Banner */}
            <section className="registration_banner">

                <div className="students-banner">
                <h2>How 50+ students saved themselves!</h2>
                </div>

                <div className="register">
                    <Link to='/signin'><button className='reg'>Register</button></Link>
                </div>   
            </section>




            {/* Reviews Section */}
            <div className="reviews">
            <ReviewSection/>
                <div className="features_banner"><h2>What you'll get for 𝟻̶𝟶̶𝟶̶𝟶̶ 199</h2></div>
            </div>





            {/* features Section */}

                    {/* features 1 */}
                    
                        <Feature text="Personalized career analysis with the experience of 5,000+ coders and market trends." img="./linkedin.png" orient="left"/>

                    {/* features 2 */}

                       <Feature text="Unique recommendations based on your personality types, IQ and more." img="./github.png" orient="right" />

                    {/* features 3 */}
                        <Feature text=" Free assistant/chatbot to aid with career related doubts." img ="./trophy-red.png" orient="left"/>

                    {/* features 4 */}

                        <Feature text="Free resources & downloadable result for recommended domains." img="./nig_coder.jpg" orient="right"/>



            {/* Footer Section */}

                        <div className="footer">
                <div className="footer-content">
                    <div className="footer-logo">
                        <h2>TechPath Scout</h2>
                    </div>
                    <div className="footer-links">
                        <ul>
                            <li><Link to="/AboutUs">About Us</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                            <li><Link to="/FAQ">FAQ</Link></li>
                        </ul>
                    </div>
                    <div className="footer-socials">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                            <img src="/facebook-icon.png" alt="Facebook" />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                            <img src="/twitter-icon.png" alt="Twitter" />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                            <img src="/linkedin-icon.png" alt="LinkedIn" />
                        </a>
                    </div>
                    <div className="footer-contact">
                        <p>Email: support.techpathscout@gmail.com</p>
                        <p>Phone: +91 8175966910</p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2024 TechPath Scout. All rights reserved.</p>
                </div>
            </div>





        </div>
    );
} 