import React, { useState, useEffect } from 'react';
import './TextBlock.css';

function Typewriter({ text, speed, delayAfterPunctuation, onComplete }) {
    const [displayedText, setDisplayedText] = useState('');
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (index < text.length) {
            let char = text.charAt(index);
            let delay = speed;

            if (char === '.' || char === ',' || char === '!' || char === '?') {
                delay += delayAfterPunctuation;
                setDisplayedText((prev) => prev + char + '<br />');
            } else {
                setDisplayedText((prev) => prev + char);
            }

            const timeout = setTimeout(() => {
                setIndex((prev) => prev + 1);
            }, delay);

            return () => clearTimeout(timeout);
        } else if (onComplete) {
            onComplete(); // Notify when typing is complete
        }
    }, [index, text, speed, delayAfterPunctuation, onComplete]);

    return <span dangerouslySetInnerHTML={{ __html: displayedText }} />;
}

function TextBlock({ onContentComplete }) {
    const [startTyping, setStartTyping] = useState(false);
    const [headingTyped, setHeadingTyped] = useState(false);
    const [contentTyped, setContentTyped] = useState(false);

    useEffect(() => {
        const delayTimeout = setTimeout(() => {
            setStartTyping(true);
        }, 100);

        return () => clearTimeout(delayTimeout);
    }, []);

    const title = "";
    const content = `Now's the time -- "OWN" your future..
     80% coders are regretting their decisions so make sure you select wisely and "not" follow others blindly when it comes to your career..
        AI/ML | Data Science | Web Dev | Cybersecurity | Game Dev  .--don't know what to pick?
        .We will help you find your ideal domain of excellence so that you can get ahead of 99% coders.
        .But first do you "want to" help yourself?
        `;

    return (
        <div id="textblock">
            
            
            <div id="textblock-container">
                
                <p className='textblock-head'><span className='n1'>8/10</span> CODERS ARE CLUELESS!</p>
                    <p id="textblock-content">
                        <Typewriter 
                            text={content} 
                            speed={2} 
                            delayAfterPunctuation={10} 
                            onComplete={() => {
                                setContentTyped(true);
                                if (onContentComplete) {
                                    onContentComplete(); // Notify the parent or another component
                                }
                            }} 
                        />
                    </p>
                
                
            </div>


            <div className="graphix">
            <img src='/coder_confusednw.png'></img>
            </div>
            
            
        </div>
    );
}

export default TextBlock;
