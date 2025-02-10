import React, { useState, useEffect, useRef } from 'react';
import './assistant.css';

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

function Assistant() {
    const [userInput, setUserInput] = useState('');
    const [response, setResponse] = useState('');
    const [startTyping, setStartTyping] = useState(false);

    // Define a prompt to attach to the user input
    const prompt = `As a computer science advisor, provide concise, clear, and point-based answers to the student's query. Keep responses under 50 words and focus on brevity and clarity.\n\n`;

    const handleSubmit = async (event) => {
        event.preventDefault();
        await submitQuery();
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            submitQuery();
        }
    };

    const submitQuery = async () => {
        // Clear the previous response and stop typing
        setResponse('');
        setStartTyping(false);

        // Concatenate the prompt with the user input
        const fullText = `${prompt}${userInput}`;

        try {
            const res = await fetch('https://techpath-scout-server.vercel.app/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: fullText }),
            });

            const data = await res.json();
            if (data && data.story) {
                const formattedResponse = parseResponse(data.story);
                setResponse(formattedResponse);
                setStartTyping(true);
            } else {
                console.error('Invalid response data:', data);
                setResponse('Error: No valid response from the server.');
                setStartTyping(false);
            }
        } catch (error) {
            console.error('Error:', error);
            setResponse('Error: Could not fetch response.');
            setStartTyping(false);
        }
    };

    // Parse the response to format the text
    const parseResponse = (text) => {
        if (!text) return ''; // Handle undefined or null text

        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // bold
            .replace(/\*(.*?)\*/g, '<em>$1</em>') // italic
            .replace(/^### (.*)$/gm, '<h3>$1</h3>') // heading 3
            .replace(/^## (.*)$/gm, '<h2>$1</h2>') // heading 2
            .replace(/^# (.*)$/gm, '<h1>$1</h1>') // heading 1
            .replace(/^- (.*)$/gm, '<ul><li>$1</li></ul>') // unordered list
            .replace(/^\d+\. (.*)$/gm, '<ol><li>$1</li></ol>') // ordered list
            .replace(/^> (.*)$/gm, '<blockquote>$1</blockquote>') // blockquote
            .replace(/(?<!<\/?\w+>)(\r?\n)/g, '<br>'); // line breaks
    };

    return (
        <div className="assistant-wrapper">
        <div className="assistant-container">
            <h2 className="assistant-title">Feel free to ask any questions!</h2>
            <form onSubmit={handleSubmit} className="assistant-form">
                <textarea
                    className="assistant-input"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="How can we help... (Press Enter to submit)"
                    rows={5}
                    cols={30}
                />
                <button type="submit" className="assistant-button">
                    Submit
                </button>
            </form>
            <div className="assistant-response">
                <h3>Response:</h3>
                {startTyping && (
                    <Typewriter 
                        text={response} 
                        speed={10} // Adjust speed as needed
                        delayAfterPunctuation={500} // Adjust delay as needed
                    />
                )}
            </div>
        </div>
        </div>
    );
}

export default Assistant;