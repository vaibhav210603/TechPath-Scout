import React, { useEffect, useState } from 'react';
import './mcq.css';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

export default function Mcq({ setQuizResults }) {
  const location = useLocation();
  const { user_details } = location.state || { user_details: [] };
  const [questionsSelected, setQuestionsSelected] = useState([]);
  const [options, setOptions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchQues = async () => {
      // Fetch questions from both files
      const [resp1, resp2] = await Promise.all([
        fetch('/assets/ques1.json'),
        fetch('/assets/ques2.json'),
      ]);

      const [data1, data2] = await Promise.all([resp1.json(), resp2.json()]);

      // Select 5 random questions from each set
      const getRandomQuestions = (data, count) => {
        const shuffled = data.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
      };

      const selectedQuestions1 = getRandomQuestions(data1.questions, 8);
      const selectedQuestions2 = getRandomQuestions(data2.questions, 7);

      // Combine questions from both files
      const selectedQuestions = [...selectedQuestions1, ...selectedQuestions2];

      // Map questions and options
      const questions = selectedQuestions.map((i) => i.question);
      const opt = selectedQuestions.map((i) => i.options);

      setQuestionsSelected(questions);
      setOptions(opt);
      setAnswers(new Array(questions.length).fill(null));
    };

    fetchQues();
  }, []);

  const handleOptionSelect = (optionText) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = optionText;
    setAnswers(updatedAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questionsSelected.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const finishQuiz = () => {
    const results = questionsSelected.map((question, index) => ({
      question,
      selectedOption: answers[index],
    }));

    // Use the function passed from the parent to update the results
    setQuizResults(results);
    
    // Navigate to the results page and pass the results as state
    navigate('/resultgen', { state: { results, user_details } });
  };

  return (
    <div className="bigger_container">
      <div className="contain">
        <div className="ques">
          <h2>
            {questionsSelected[currentQuestionIndex]}
          </h2>
          <p className="question_number">
            Question {currentQuestionIndex + 1} / {questionsSelected.length}
          </p>
        </div>
        {options.length > 0 &&
          options[currentQuestionIndex].map((option, index) => (
            <div
              key={index}
              className={`option ${
                answers[currentQuestionIndex] === option ? 'selected' : ''
              }`}
              onClick={() => handleOptionSelect(option)}
            >
              {option}
            </div>
          ))}

        <div className="quiz_buttons">
          <Button
            className="prev"
            variant="primary"
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Prev
          </Button>
          <Button
            className="next"
            variant="primary"
            onClick={nextQuestion}
            disabled={currentQuestionIndex === questionsSelected.length - 1}
          >
            Next
          </Button>
          <Button
            className="finish"
            variant="success"
            onClick={finishQuiz}
            disabled={answers.includes(null)}
          >
            Finish
          </Button>
        </div>
      </div>
    </div>
  );
}
