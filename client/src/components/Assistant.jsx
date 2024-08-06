import React, { useState } from 'react';
import './assistant.css';

function App() {
  const [userInput, setUserInput] = useState('');
  const [response, setResponse] = useState('');

  // Define a prompt to attach to the user input
  const prompt = `You are a counselor of the computer science domain stream and advise the student based on their query,GIVE SHORT AND CRISP ANSWERS about less than 100 words and in points:\n\n`;

  const handleSubmit = async (event) => {
    event.preventDefault();

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
      const formattedResponse = parseResponse(data.story);
      setResponse(formattedResponse);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Parse the response to format the text
  const parseResponse = (text) => {
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
    <div className="assistant-container">
      <h2 className="assistant-title">Feel free to ask any questions!</h2>
      <form onSubmit={handleSubmit} className="assistant-form">
        <textarea
          className="assistant-input"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask me anything..."
          rows={5}
          cols={30}
        />
        <button type="submit" className="assistant-button">
          Submit
        </button>
      </form>
      <div className="assistant-response">
        <h3>Response:</h3>
        <div dangerouslySetInnerHTML={{ __html: response }} />
      </div>
    </div>
  );
}

export default App;
