import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './ResultGen.css';

function ResultGen() {
  const location = useLocation();
  const { results } = location.state || { results: [] };
  const [response, setResponse] = useState('');

  // Convert questions and answers to a single string
  const questionsAnswersString = results
    .map(
      (item, index) =>
        `Q${index + 1}: ${item.question}\nA${index + 1}: ${item.selectedOption}`
    )
    .join('\n\n');

  // Prompt for the AI model
  const prompt =
    'Consider yourself as a computer science domain counselor and you gave a student a set of questions and the following are his answers for each question. Give a detailed analysis of the student mindset and qualities and justify which computer science domain he should be choosing and why, in detail, in 100 words or more, d nt use question number as reference, the report for each student must be DIFFERENT or unique, write like you are talkig to the student';

  // Combine the questions, answers, and prompt into one text
  const fullText = `${questionsAnswersString}\n\n${prompt}`;

  console.log(fullText);

  const run = async () => {
    try {
      const res = await fetch('http://localhost:8000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: fullText }),
      });

      const data = await res.json();
      setResponse(data.story);
    } catch (error) {
      console.error('Error fetching the analysis:', error);
    }
  };

  useEffect(() => {
    run();
  }, []);

  // Typewriter effect function with line breaks
  const typeWriterEffect = (element, text, speed) => {
    const sentences = text.split(/(?<=[.!?])\s+/); // Split text into sentences
    let currentIndex = 0;
    let currentText = '';
    
    const typeSentence = () => {
      if (currentIndex < sentences.length) {
        const sentence = sentences[currentIndex];
        let charIndex = 0;
        let currentLine = '';
        
        const typeCharacter = () => {
          if (charIndex < sentence.length) {
            currentLine += sentence[charIndex];
            element.innerHTML = currentText + currentLine; // Update text with current line
            charIndex++;
            setTimeout(typeCharacter, speed); // Continue typing
          } else {
            currentText += currentLine + '<br>'; // Add line break after sentence
            currentIndex++;
            currentLine = '';
            setTimeout(typeSentence, speed); // Move to next sentence
          }
        };
        
        typeCharacter();
      }
    };

    typeSentence();
  };

  useEffect(() => {
    const typewriterElement = document.getElementById('typewriter-response');
    if (response && typewriterElement) {
      typewriterElement.innerHTML = ''; // Clear any existing text
      typeWriterEffect(typewriterElement, response, 10); // Adjust speed as needed
    }
  }, [response]);

  return (<div className="mega">
      <h1 className='heading'>Quiz Results</h1>
    <div className='result_container'>
      <div className="typewriter">
        
      </div>
      <div id="typewriter-response" className="typewriter"></div>
    </div>
    </div>
  );
}

export default ResultGen;
