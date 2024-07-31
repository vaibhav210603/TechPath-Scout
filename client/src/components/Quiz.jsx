import React, { useState } from 'react';
import Mcq from './Mcq';
import ResultGen from './ResultGen';
import { useLocation } from 'react-router-dom';
import Timer from '../timer'
import './Quiz.css'

function Quiz() {
  const [quizResults, setQuizResults] = useState([]); 
  const location = useLocation(); // Get current location
  // State to hold quiz results

  return (
    <div className='container_quiz'>
      
      <div className="time"><Timer/></div>
      <Mcq setQuizResults={setQuizResults} />  {/* Passing setQuizResults function */}
      {location.pathname==='./resultgen' && <ResultGen results={quizResults} />}  {/* Passing quizResults data */}
   
    </div>
  );
}

export default Quiz;
