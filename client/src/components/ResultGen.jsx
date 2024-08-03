import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './ResultGen.css';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

function ResultGen() {
  const location = useLocation();
  const { results } = location.state || { results: [] };
  const { user_details } = location.state || { user_details: [] };
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
    ` Consider yourself a computer science domain counselor. You have just evaluated a student named ${user_details.name} based on a series of responses to questions designed to assess their interests, skills, and mindset. Your task is to provide a comprehensive analysis of the student's mindset and qualities, recommending which computer science domain they should pursue and why.

    Begin your response with a friendly greeting using the student's name, such as "Hey [name] in heading,". Then proceed with the analysis:
    
    Analysis: Offer an insightful evaluation of the student's strengths and weaknesses. Highlight key attributes, such as problem-solving skills, creativity, logical reasoning, and passion for technology. Provide examples from their answers to illustrate your points.
    
    Domain Recommendation: Suggest one or more computer science domains that align with the student's strengths and interests. Include a detailed justification for each recommended domain, explaining how it suits their qualities and aspirations.
    
    Improvement Suggestions: Identify areas where the student can improve, such as enhancing their logical reasoning or technical skills. Provide practical advice on how they can develop these areas, such as engaging in specific projects, courses, or activities.
    
    Domain Inclination Score: Conclude with a score out of 10 for each potential domain, representing the student's inclination towards it. Use bold formatting for each score and provide a brief justification for each rating.
    
    Ensure that the analysis for each student is unique and personalized based on their responses. Your tone should be encouraging and supportive, helping the student feel confident in their path forward.
    Give extra spaces before and after headings to make it clear`;

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
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^## (.*)$/gm, '<h2>$1</h2>')
      .replace(/^- (.*)$/gm, '<ul><li>$1</li></ul>')
      .replace(/^\d+\. (.*)$/gm, '<ol><li>$1</li></ol>')
      .replace(/^> (.*)$/gm, '<blockquote>$1</blockquote>')
      .replace(/(?<!<\/?\w+>)(\r?\n)/g, '<br>')
      .replace(/^### (.*)$/gm, '<h3>$1</h3>');

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
        <Text style={styles.heading}>TechPath Scout Report</Text> {/* Add heading */}
        <View style={styles.section}>
          <Text style={styles.text}>{response}</Text> {/* Apply the text style */}
        </View>
      </Page>
    </Document>
  );

  return (
    <div className="mega">
      <h1 className="heading">Here's your analysis {user_details.name}</h1>
      <div className="result_container">
        {isLoading ? ( 
          <div className="loading-message">Analysing your responses, please wait...</div>
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
