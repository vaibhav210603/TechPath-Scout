import React, { useEffect, useState } from 'react';
import './mcq.css';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

export default function Mcq({ setQuizResults }) {
  const [questionsSelected, setQuestionsSelected] = useState([]);
  const [options, setOptions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchQues = async () => {
      const resp = await fetch('/assets/ques1.json');
      const data = await resp.json();

      const questions = data.questions.map((i) => i.question);
      setQuestionsSelected(questions);

      const opt = data.questions.map((i) => i.options);
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
    navigate('/resultgen', { state: { results } });
  };

  return (
    <div className="bigger_container">
      <div className="contain">
        <div className="ques">
          <p>{questionsSelected[currentQuestionIndex]}</p>
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
