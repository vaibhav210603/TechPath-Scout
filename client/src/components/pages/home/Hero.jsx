import React, { useState, useEffect } from 'react';
import TextBlock from '../../../constants/TextBlock';
import { Parallax, ParallaxLayer } from '@react-spring/parallax';
import './Hero.css';
import { Link } from "react-router-dom";

export default function Hero() {
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [buttonVisible, setButtonVisible] = useState(false);

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

    return (
        <div>
            <Parallax pages={2} style={{ top: '0', left: '0' }} className={`animation ${imagesLoaded ? 'loaded' : ''}`}>
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
                            <button 
                                className={`after_textbox ${buttonVisible ? 'visible' : ''}`}
                            >
                                Get Started
                            </button>
                        </Link>
                    </div>
                </ParallaxLayer>
            </Parallax>
        </div>
    );
}