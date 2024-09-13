import React, { useState, useEffect } from 'react';
import './TextBlock.css';

function Typewriter({ text, speed, delayAfterPunctuation, onComplete }) {
    const [displayedText, setDisplayedText] = useState('');
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (index < text.length) {
            let char = text.charAt(index);
            let delay = speed;

            // Add extra delay after punctuation marks
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

    useEffect(() => {
        const delayTimeout = setTimeout(() => {
            setStartTyping(true);
        }, 1000);

        return () => clearTimeout(delayTimeout);
    }, []);

    const title = "8/10 students are clueless!";
    const content = `Let's bulletproof your future!. 
        While 80% students regret after randomly choosing their career paths, you can confidently explore your true potential.
        AI/ML, Web Development, Cybersecurity, Game Development-- don't know what to pick?
        I will help you find your ideal domain of excellence so that you can get ahead of 99% coders.
        Click to get started ⭐`;

    return (
        <div id="textblock">
            <div id="textblock-container">
                {startTyping && (
                    <p id="textblock-title">
                        <Typewriter 
                            text={title} 
                            speed={10} 
                            onComplete={() => setTimeout(() => setHeadingTyped(true), 2000)} 
                        />
                    </p>
                )}
                {headingTyped && (
                    <p id="textblock-content">
                        <Typewriter 
                            text={content} 
                            speed={10} 
                            delayAfterPunctuation={500} 
                            onComplete={onContentComplete} // Notify when the content is fully typed
                        />
                    </p>
                )}
            </div>
            
            <footer id='textblock-footer'>...</footer>
        </div>
    );
}

export default TextBlock;
