import React from 'react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './ResultGen.css'

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
    'Consider yourself as a computer science domain counselor and you gave a student a set of questions and the following are his answers for each question. Give a detailed analysis of the student mindset and qualities and justify which computer science domain he should be choosing and why, in detail, in 200 words or more, d nt use question number as reference t perormace isntaead use keywrds seelct4d';

  // Combine the questions, answers, and prompt into one text
  const fullText = `${questionsAnswersString}\n\n${prompt}`;

  console.log(fullText);

//   const formatResponse = (text) => {
//     // Replace *...* with <strong>...</strong>
//     let formattedText = text.replace(/\*([^*]+)\*/g, '<strong>$1</strong>');

//     // Replace newline characters with <br> for line breaks
//     formattedText = formattedText.replace(/\n/g, '<br>');

//     return formattedText;
//   };

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
    } 
    catch (error)
    {
      console.error('Error fetching the analysis:', error);
    }
  };

  // Trigger the API call once the component mounts
  React.useEffect(() => {
    run();
  }, []);

  return (
    <div className='result_container'>
      <h1>Quiz Results</h1>
     
      <p className='response_text'>{response}</p>
    </div>
  );
}

export default ResultGen;
