import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNavigate, useLocation } from 'react-router-dom';
import './assistant.css';
import { API_ENDPOINTS } from '../../../config/api';

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
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState(null);
    const [messages, setMessages] = useState([
        { text: "Hello! I'm your AI career assistant. How can I help you navigate your tech path today?", sender: 'ai' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (!isLoading) {
            scrollToBottom();
        }
    }, [messages, isLoading]);

    // Check for user authentication on component mount
    useEffect(() => {
        // First check if user details were passed via navigation state
        if (location.state?.user_details) {
            setUserDetails(location.state.user_details);
            return;
        }

        // Then check localStorage for saved user
        const savedUser = localStorage.getItem('tp_user');
        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);
                setUserDetails(user);
            } catch (error) {
                console.error('Error parsing saved user:', error);
                localStorage.removeItem('tp_user');
                navigate('/signin', { state: { redirectTo: '/assistant' } });
            }
        } else {
            // No user found, redirect to signin
            navigate('/signin', { state: { redirectTo: '/assistant' } });
        }
    }, [location.state, navigate]);

    // Fetch previous chats when user details are available
    useEffect(() => {
        if (userDetails?.user_id) {
            setIsLoadingHistory(true);
            fetch(`${API_ENDPOINTS.ASSISTANTS}?user_id=${userDetails.user_id}`)
                .then(res => {
                    if (!res.ok) throw new Error('Failed to fetch chat history');
                    return res.json();
                })
                .then(data => {
                    if (Array.isArray(data) && data.length > 0) {
                        // Get the most recent chat
                        const lastChat = data[data.length - 1];
                        try {
                            const parsed = JSON.parse(lastChat.chat_history);
                            if (Array.isArray(parsed) && parsed.length > 0) {
                                setMessages(parsed);
                            }
                        } catch (error) {
                            console.error('Error parsing chat history:', error);
                        }
                    }
                })
                .catch(error => {
                    console.error('Error fetching chat history:', error);
                })
                .finally(() => {
                    setIsLoadingHistory(false);
                });
        }
    }, [userDetails?.user_id]);

    const handleSend = async () => {
        if (input.trim() === '' || isLoading || !userDetails) return;

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
                fetch(API_ENDPOINTS.ASSISTANTS, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user_id: userDetails.user_id,
                        chat_history: JSON.stringify(newMessages)
                    })
                }).catch(error => {
                    console.error('Error saving chat history:', error);
                });
                
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

    // Show loading state while checking authentication
    if (!userDetails) {
        return (
            <div className="assistant-wrapper">
                <div className="chat-container">
                    <div className="chat-header">
                        <h2>Your AI Career Assistant</h2>
                    </div>
                    <div className="chat-messages">
                        <div className="chat-message ai">
                            <p>Loading...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="assistant-wrapper">
            <div className="chat-container">
                <div className="chat-header">
                    <h2>Your AI Career Assistant</h2>
                    <p style={{ fontSize: '14px', color: '#666', margin: '5px 0' }}>
                        Welcome back, {userDetails.full_name}!
                    </p>
                </div>
                <div className="chat-messages">
                    {isLoadingHistory ? (
                        <div className="chat-message ai">
                            <p>Loading your previous conversations...</p>
                        </div>
                    ) : (
                        messages.map((msg, index) =>
                            msg.sender === 'ai' ? (
                                <AiChatMessage key={index} message={msg.text} />
                            ) : (
                                <UserChatMessage key={index} message={msg.text} />
                            )
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
                        disabled={isLoading || isLoadingHistory}
                    />
                    <button onClick={handleSend} disabled={isLoading || isLoadingHistory}>
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Assistant;