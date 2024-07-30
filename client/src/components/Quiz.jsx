import React, { useState } from 'react';
import Mcq from './Mcq';
import ResultGen from './ResultGen';
import { useLocation } from 'react-router-dom';
import Timer from '../timer'

function Quiz() {
  const [quizResults, setQuizResults] = useState([]); 
  const location = useLocation(); // Get current location
  // State to hold quiz results

  return (
    <div>
      <Timer/>
      <Mcq setQuizResults={setQuizResults} />  {/* Passing setQuizResults function */}
      {location.pathname==='./resultgen' && <ResultGen results={quizResults} />}  {/* Passing quizResults data */}
    </div>
  );
}

export default Quiz;
