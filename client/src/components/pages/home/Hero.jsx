import React, { useState, useEffect, useRef } from 'react';
import TextBlock from '../../../constants/TextBlock';
import { Parallax, ParallaxLayer } from '@react-spring/parallax';
import './Hero.css';
import { Link } from "react-router-dom";
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const reviews = [
    {
      name: "Vivek Pal",
      review: "I was lost when it came to making the right career choices. This platform gave me the clarity I desperately needed, showing me the right path to pursue. Looking back, the investment in time and money was worth every bit. I’m now confidently on track to success!",
      stars: 5
    },
    {
      name: "Priyanshu Bhist",
      review: "At first, I was unsure if I should even go for it, but this has been a life-changer. It not only helped me find my direction but also saved me from making costly mistakes. Now, I'm in a much better place in my career, and I owe a lot to this guidance.",
      stars: 4
    },
    {
      name: "Vinayak Sisodiya",
      review: "I was all over the place before. This service helped me focus on the right opportunities and avoid wasting time. My career has accelerated in ways I couldn’t have imagined, and I’m proud of where I am today, all thanks to the guidance provided.",
      stars: 5
    },
    {
      name: "Bhavya Chimpa",
      review: "Before this, I had no idea where to even begin. It provided me with a clear and structured approach, helping me save both time and money. I’m now progressing smoothly in my field, and I can honestly say this was a critical part of my journey.",
      stars: 5
    },
    {
      name: "Vaibhav Upadhyay",
      review: "I was at a crossroads and unsure about my next steps. Thanks to the personalized advice I received, I was able to make smart choices and avoid unnecessary detours. It's one of the best investments I’ve made for my career, and it’s paying off immensely now.",
      stars: 4
    },
    {
      name: "Udit Singh",
      review: "The insights and recommendations I got helped me pivot to a career that suits me perfectly. I saved so much time by cutting through the confusion and focusing on what really matters. It’s amazing how much progress I’ve made in such a short period.",
      stars: 5
    },
    {
      name: "Sanket Patil",
      review: "I was struggling to figure out which path would bring me success. This platform made it crystal clear what my next steps should be. Now, I’m in a thriving career, and the time I spent using this service was the best investment I could have made.",
      stars: 5
    },
    {
      name: "Utkarsh Nayak",
      review: "I was uncertain about the future, but this helped me realize where I truly belong. The guidance I received not only saved me time and money but also gave me the confidence to pursue my dreams. Today, I’m proud of how far I’ve come.",
      stars: 4
    }
  ];
  
const ReviewCard = ({ name, review, stars }) => (
  <div className="review-card">
    <h3>{name}</h3>
    <p>{review}</p>
    <div className="stars">
      {[...Array(5)].map((_, i) => (
        <Star key={i} fill={i < stars ? "#FFD700" : "none"} stroke={i < stars ? "#FFD700" : "#000"} />
      ))}
    </div>
  </div>
);

export default function Hero() {
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [buttonVisible, setButtonVisible] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const reviewContainerRef = useRef(null);

    useEffect(() => {
        const images = Array.from(document.querySelectorAll('.animation_layer'));
        let loadedImagesCount = 0;

        if (images.length === 0) {
            setImagesLoaded(true);
            return;
        }

        const onImageLoad = () => {
            loadedImagesCount += 1;
            if (loadedImagesCount === images.length) {
                setImagesLoaded(true);
            }
        };

        images.forEach((layer) => {
            const img = new Image();
            img.src = layer.style.backgroundImage.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '');
            img.onload = onImageLoad;
            img.onerror = onImageLoad;
        });
    }, []);

    const scrollReviews = (direction) => {
        if (reviewContainerRef.current) {
            const container = reviewContainerRef.current;
            const cardWidth = container.offsetWidth;
            const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
            
            let newIndex = currentIndex + (direction === 'left' ? -1 : 1);
            newIndex = Math.max(0, Math.min(newIndex, reviews.length - 1));
            
            setCurrentIndex(newIndex);
            container.scrollTo({
                left: newIndex * cardWidth,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div>
            <Parallax pages={3} style={{ top: '0', left: '0' }} className={`animation ${imagesLoaded ? 'loaded' : ''}`}>
                {/* Existing ParallaxLayers */}
                <ParallaxLayer offset={0} speed={0.25}>
                    <div className="animation_layer parallax" id="artback"></div>
                </ParallaxLayer>
                <ParallaxLayer offset={0} speed={0.3}>
                    <div className="animation_layer parallax" id="mountain"></div>
                </ParallaxLayer>
                <ParallaxLayer offset={0} speed={-0.5}>
                    <div className="animation_layer parallax" id="logoland"></div>
                </ParallaxLayer>
                <ParallaxLayer offset={0} speed={0.4}>
                    <div className="animation_layer parallax" id="jungle1"></div>
                </ParallaxLayer>
                <ParallaxLayer offset={0} speed={0.45}>
                    <div className="animation_layer parallax" id="jungle2"></div>
                </ParallaxLayer>
                <ParallaxLayer offset={0} speed={0.6}>
                    <div className="animation_layer parallax" id="jungle3"></div>
                </ParallaxLayer>
                <ParallaxLayer offset={0} speed={0.6}>
                    <div className="animation_layer parallax" id="jungle4"></div>
                </ParallaxLayer>
                <ParallaxLayer offset={0} speed={0.3}>
                    <div className="animation_layer parallax" id="manonmountain"></div>
                </ParallaxLayer>
                <ParallaxLayer offset={0} speed={0.55}>
                    <div className="animation_layer parallax" id="jungle5"></div>
                </ParallaxLayer>
                <ParallaxLayer offset={1} speed={0.25}>
                    
                    <TextBlock onContentComplete={() => setButtonVisible(true)} />
                    <div className='aftertext'>
                        <Link to="./signin">
                            <button className={`after_textbox ${buttonVisible ? 'visible' : ''}`}>
                                Whatever it takes!
                            </button>
                        </Link>   
                    </div>  
                </ParallaxLayer>
                <ParallaxLayer offset={2} speed={0.1}>
                <div className="banner"><p className='text1'>How 50+ students saved themselves!</p></div>
                <div className="review-section">
                        
                        <div className="review-scroll-container">
                            <button 
                                className="scroll-button left" 
                                onClick={() => scrollReviews('left')}
                                disabled={currentIndex === 0}
                            >
                                <ChevronLeft />
                            </button>
                            <div className="review-container" ref={reviewContainerRef}>
                                {reviews.map((review, index) => (
                                    <ReviewCard key={index} {...review} />
                                ))}
                            </div>
                            <button 
                                className="scroll-button right" 
                                onClick={() => scrollReviews('right')}
                                disabled={currentIndex === reviews.length - 1}
                            >
                                <ChevronRight />
                            </button>
                        </div>
                    </div>
                </ParallaxLayer>
            </Parallax>
        </div>
    );
}