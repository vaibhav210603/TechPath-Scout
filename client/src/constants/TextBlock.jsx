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
            if (char === '.' || char === '!' || char === '?') {
                delay += delayAfterPunctuation;
                // Insert a line break after punctuation
                setDisplayedText((prev) => prev + char + '<br />');
            } else {
                setDisplayedText((prev) => prev + char);
            }

            const timeout = setTimeout(() => {
                setIndex((prev) => prev + 1);
            }, delay);

            return () => clearTimeout(timeout);
        } else if (onComplete) {
            onComplete();
        }
    }, [index, text, speed, delayAfterPunctuation, onComplete]);

    return <span dangerouslySetInnerHTML={{ __html: displayedText }} />;
}

function TextBlock() {
    const [startTyping, setStartTyping] = useState(false);
    const [headingTyped, setHeadingTyped] = useState(false);

    useEffect(() => {
        // Start typing after a 2-second delay
        const delayTimeout = setTimeout(() => {
            setStartTyping(true);
        }, 2000);

        return () => clearTimeout(delayTimeout);
    }, []);

    const title = "Welcome to TechPath Scout!";
    const content = ` I'm an AI integrated platform designed to help you find software domains ideal for you !

    While many students navigate their academic paths without clear guidance, you can confidently explore your true potential.
    
    I am designed to ensure that you choose your career wisely, find personalized insights, and make well-informed decisions, turning confusion into a clear vision for your future in the dynamic world of computer science.
    
    Get a personalised report on yourself and analyze to find what suits you best.
    
    FREE ROADMAPS AND RESOURCES FOR YOUR JOURNEY TOO😎!
    
    
    >>Click below to get started⭐<<`;

    return (
        <div id="textblock">
            <div id="textblock-container">
                {startTyping && (
                    <p id="textblock-title">
                        <Typewriter 
                            text={title} 
                            speed={10} 
                           // Adjust delay as needed
                            onComplete={() => {
                                setTimeout(() => {
                                    setHeadingTyped(true);
                                }, 2000); // Wait for 2 seconds before starting the paragraph
                            }}
                        />
                    </p>
                )}
                {headingTyped && (
                    <p id="textblock-content">
                        <Typewriter 
                            text={content} 
                            speed={10} 
                            delayAfterPunctuation={500} // Adjust delay as needed
                        />
                    </p>
                )}
            </div>
            <footer id='textblock-footer'>Created With 🧡 By Vaibhav Upadhyay</footer>
        </div>
    );
}

export default TextBlock;
