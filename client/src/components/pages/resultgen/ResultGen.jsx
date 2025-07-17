import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './ResultGen.css';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, Image } from '@react-pdf/renderer';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { API_ENDPOINTS } from '../../../config/api';

ChartJS.register(ArcElement, Tooltip, Legend);

function ResultGen() {
  const location = useLocation();
  const { user_details = {} } = location.state || {};
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [scores, setScores] = useState([]);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [chartImage, setChartImage] = useState(null);
  const [retrievedUser, setRetrievedUser] = useState(null);

  // Try to retrieve user data from localStorage if navigation state is lost
  useEffect(() => {
    if (!user_details.user_id) {
      const storedUser = localStorage.getItem('tp_user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setRetrievedUser(parsedUser);
          fetchUserResult(parsedUser.user_id);
        } catch (error) {
          console.error('Error parsing stored user:', error);
        }
      } else {
        setIsLoading(false);
      }
    } else {
      fetchUserResult(user_details.user_id);
    }
    // eslint-disable-next-line
  }, []);

  const fetchUserResult = async (userId) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_ENDPOINTS.USERS}/${userId}`);
      if (response.ok) {
        const user = await response.json();
        if (user.result) {
          setResponse(user.result);
          setScores(extractScoresFromResponse(user.result));
          }
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const extractScoresFromResponse = (responseText) => {
    const scoreMatches = responseText.match(/\*\*(.*?)\*\*:\s*(\d+)\/10/g) || [];
    return scoreMatches.map(match => {
      const parts = match.match(/\*\*(.*?)\*\*:\s*(\d+)/);
      return {
        domain: parts[1],
        score: parseInt(parts[2], 10),
      };
    });
  };

  useEffect(() => {
    const typewriterElement = document.getElementById('typewriter-response');
    if (response && typewriterElement) {
      typewriterElement.innerHTML = '';
      typeWriterEffect(typewriterElement, response, 5);
    }
  }, [response]);

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
      } else {
        setIsTypingComplete(true);
      }
    };

    typeSentence();
  };

  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#FFFFFF',
      padding: 30,
    },
    section: {
      margin: 10,
      padding: 10,
    },
    heading: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    subheading: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 15,
      marginBottom: 5,
    },
    text: {
      fontSize: 12,
      marginBottom: 5,
    },
    bold: {
      fontWeight: 'bold',
    },
    italic: {
      fontStyle: 'italic',
    },
    listItem: {
      fontSize: 12,
      marginLeft: 10,
    },
    chartContainer: {
      marginTop: 20,
      alignItems: 'center',
    },
    chart: {
      width: 300,
      height: 300,
    },
  });

  const formatResponseText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^## (.*)$/gm, '<h2>$1</h2>')
      .replace(/^### (.*)$/gm, '<h3>$1</h3>')
      .replace(/^- (.*)$/gm, '• $1')
      .replace(/^\d+\. (.*)$/gm, '$1')
      .replace(/^> (.*)$/gm, '"$1"')
      .split('\n')
      .filter(line => line.trim() !== '');
  };

  const renderFormattedText = (text) => {
    const parts = text.split(/(<\/?(?:strong|em|h[23])>)/);
    return parts.map((part, index) => {
      if (part.startsWith('<strong>')) {
        return <Text key={index} style={styles.bold}>{part.replace(/<\/?strong>/g, '')}</Text>;
      } else if (part.startsWith('<em>')) {
        return <Text key={index} style={styles.italic}>{part.replace(/<\/?em>/g, '')}</Text>;
      } else if (part.startsWith('<h2>')) {
        return <Text key={index} style={styles.subheading}>{part.replace(/<\/?h2>/g, '')}</Text>;
      } else if (part.startsWith('<h3>')) {
        return <Text key={index} style={[styles.subheading, { fontSize: 16 }]}>{part.replace(/<\/?h3>/g, '')}</Text>;
      } else {
        return <Text key={index}>{part}</Text>;
      }
    });
  };

  const chartData = {
    labels: scores.map(score => score.domain),
    datasets: [
      {
        data: scores.map(score => score.score),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  useEffect(() => {
    if (scores.length > 0) {
      const chart = document.createElement('canvas');
      new ChartJS(chart, {
        type: 'doughnut',
        data: chartData,
        options: { responsive: false, width: 300, height: 300 }
      });
      setChartImage(chart.toDataURL());
    }
  }, [scores]);

  const MyDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.heading}>TechPath Scout Report</Text>
        {formatResponseText(response).map((paragraph, index) => {
          if (paragraph.startsWith('•')) {
            return <Text key={index} style={styles.listItem}>{renderFormattedText(paragraph)}</Text>;
          } else {
            return <View key={index} style={styles.text}>{renderFormattedText(paragraph)}</View>;
          }
        })}
        {chartImage && (
          <View style={styles.chartContainer}>
            <Image style={styles.chart} src={chartImage} />
          </View>
        )}
      </Page>
    </Document>
  );

  if (!response) {
    return <div className="loading-message">No data available. Please try again.</div>;
  }

  return (
    <div className="mega">
      <div className="heading typewrite">
        <h2>Here's your analysis, {user_details.full_name || user_details.name || retrievedUser?.full_name || retrievedUser?.name}</h2>
      </div>
      <div className="result_container">
        {isLoading ? (
          <div className="loading-message">
            Loading your analysis, please wait...
          </div>
        ) : response ? (
          <>
            <div id="typewriter-response" className="typewriter"></div>
            {scores.length > 0 && isTypingComplete && (
              <div className={`chart-container ${showChart ? 'show' : ''}`}>
                <Doughnut data={chartData} />
              </div>
            )}
          </>
        ) : (
          <div className="loading-message">
            No analysis available. Please try again.
            <br />
            <small>Debug: Response length: {response?.length || 0}, Scores: {scores.length}</small>
          </div>
        )}
      </div>
      {response && (
        <PDFDownloadLink document={<MyDocument />} fileName="TechPathScoutReport.pdf">
          {({ blob, url, loading, error }) =>
            loading ? 'Preparing document...' : <button className='download'>Download PDF</button>
          }
        </PDFDownloadLink>
      )}
    </div>
  );
}

export default ResultGen;