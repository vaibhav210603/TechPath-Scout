import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './ResultGen.css';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

function ResultGen() {
  const location = useLocation();
  const { results } = location.state || { results: [] };
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  // Converting the prop ques, ans to string
  const questionsAnswersString = results
    .map(
      (item, index) =>
        `Q${index + 1}: ${item.question}\nA${index + 1}: ${item.selectedOption}`
    )
    .join('\n\n');

  // Attaching the prompt to the string
  const prompt =
    'Consider yourself as a computer science domain counselor and you gave a student a set of questions and the following are his answers for each question. Give a detailed analysis of the student mindset and qualities and justify which computer science domain he should be choosing and why, in detail, in 100 words or more, do not use question numbers as references, the report for each student must be DIFFERENT or unique, write like you are talking to the student, at the end provide a digit/10 representing the inclination for each potential domain suitable, bold the flaws like incorrect logical reasoning and strong points of the candidate; also mention what should he do to improve overall;;PLEASE BOLD THE KEYWORDS IN BETWEEEN TEXT ';

  const fullText = `${questionsAnswersString}\n\n${prompt}`;

  console.log(fullText);

  // Sending the string of response to backend
  const run = async () => {
    try {
      setIsLoading(true); // Set loading to true
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
    } finally {
      setIsLoading(false); // Set loading to false
    }
  };

  useEffect(() => {
    run();
  }, []);

  // Typewriter effect
  const typeWriterEffect = (element, text, speed) => {
    const formattedText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');

    const sentences = formattedText.split(/(?<=[.!?])\s+/);
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
            element.innerHTML = currentText + currentLine;
            charIndex++;
            setTimeout(typeCharacter, speed);
          } else {
            currentText += currentLine + '<br>';
            currentIndex++;
            currentLine = '';
            setTimeout(typeSentence, speed);
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
      typewriterElement.innerHTML = '';
      typeWriterEffect(typewriterElement, response, 10);
    }
  }, [response]);

  console.log(response);

  // Define styles for PDF with heading
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#E4E4E4',
      padding: 20,
    },
    heading: {
      fontSize: 20,
      marginBottom: 10,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
    text: {
      fontSize: 12,
      fontFamily: 'Times-Roman',
    },
  });

  const MyDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.heading}>TechPath Scout Analysis Report</Text> {/* Add heading */}
        <View style={styles.section}>
          <Text style={styles.text}>{response}</Text> {/* Apply the text style */}
        </View>
      </Page>
    </Document>
  );

  return (
    <div className="mega">
      <h1 className="heading">Quiz Results</h1>
      <div className="result_container">
        {isLoading ? ( 
          <div className="loading-message">Analysing your results</div>
        ) : (
          <div id="typewriter-response" className="typewriter"></div>
        )}
      </div>
      <PDFDownloadLink document={<MyDocument />} fileName="report.pdf">
        {({ blob, url, loading, error }) =>
          loading ? 'Preparing document...' : <button className='download'>Download PDF</button>
        }
      </PDFDownloadLink>
    </div>
  );
}

export default ResultGen;
