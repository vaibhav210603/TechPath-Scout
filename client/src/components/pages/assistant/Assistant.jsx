import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import './assistant.css';
import { API_ENDPOINTS } from '../../../config/api';
import { useLocation } from 'react-router-dom';

// New AI Message component with stable typing animation
const AiChatMessage = ({ message }) => {
    const [visibleText, setVisibleText] = useState('');
    const [isTyping, setIsTyping] = useState(true);

    useEffect(() => {
        setVisibleText('');
        setIsTyping(true);
        let i = 0;
        const intervalId = setInterval(() => {
            if (i < message.length) {
                setVisibleText(message.substring(0, i + 1));
                i++;
            } else {
                clearInterval(intervalId);
                setIsTyping(false);
            }
        }, 20); // Typing speed

        return () => clearInterval(intervalId);
    }, [message]);

    return (
        <div className="chat-message ai">
            {/* Render the full message but make the untyped part invisible */}
            <div className="markdown-body">
                <ReactMarkdown>{visibleText + (isTyping ? '▍' : '')}</ReactMarkdown>
                <span style={{ visibility: 'hidden', height: 0, display: 'block' }}>
                    <ReactMarkdown>{message}</ReactMarkdown>
                </span>
            </div>
        </div>
    );
};

const UserChatMessage = ({ message }) => {
    return (
        <div className="chat-message user">
            <p>{message}</p>
        </div>
    );
};

function Assistant() {
    const location = useLocation();
    const { user_details = {} } = location.state || {};
    const [messages, setMessages] = useState([
        { text: "Hello! I'm your AI career assistant. How can I help you navigate your tech path today?", sender: 'ai' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (!isLoading) {
            scrollToBottom();
        }
    }, [messages, isLoading]);

    // Fetch previous chats on load
    useEffect(() => {
        if (user_details.user_id) {
            fetch(`${API_ENDPOINTS.ASSISTANTS}?user_id=${user_details.user_id}`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data) && data.length > 0) {
                        // Assume chat_history is a stringified array of messages
                        const lastChat = data[data.length - 1];
                        try {
                            const parsed = JSON.parse(lastChat.chat_history);
                            if (Array.isArray(parsed)) setMessages(parsed);
                        } catch {}
                    }
                })
                .catch(() => {});
        }
    }, [user_details.user_id]);

    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;

        const userMessage = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await fetch(API_ENDPOINTS.CHAT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: input }),
            });

            if (!res.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await res.json();
            const aiMessage = { text: data.reply, sender: 'ai' };
            setMessages(prev => {
                const newMessages = [...prev, aiMessage];
                // Save chat history to backend
                if (user_details.user_id) {
                    fetch(API_ENDPOINTS.ASSISTANTS, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            user_id: user_details.user_id,
                            chat_history: JSON.stringify(newMessages)
                        })
                    });
                }
                return newMessages;
            });

        } catch (error) {
            console.error("Failed to fetch AI response:", error);
            const errorMessage = { text: "Sorry, I'm having trouble connecting. Please try again later.", sender: 'ai' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="assistant-wrapper">
            <div className="chat-container">
                <div className="chat-header">
                    <h2>Your AI Career Assistant</h2>
                </div>
                <div className="chat-messages">
                    {messages.map((msg, index) =>
                        msg.sender === 'ai' ? (
                            <AiChatMessage key={index} message={msg.text} />
                        ) : (
                            <UserChatMessage key={index} message={msg.text} />
                        )
                    )}
                    {isLoading && (
                        <div className="chat-message ai">
                            <div className="typing-indicator">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <div className="chat-input-area">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask me anything about tech careers..."
                        rows={1}
                        disabled={isLoading}
                    />
                    <button onClick={handleSend} disabled={isLoading}>
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Assistant;