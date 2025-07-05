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
  const { results = [] } = location.state || {};
  const { user_details = {} } = location.state || {};
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [scores, setScores] = useState([]);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [chartImage, setChartImage] = useState(null);

  const questionsAnswersString = results
    .map(
      (item, index) =>
        `Q${index + 1}: ${item.question}\nA${index + 1}: ${item.selectedOption}`
    )
    .join('\n\n');

  const prompt = `Consider yourself a computer science domain counselor. You have just evaluated a student named ${user_details.name} based on a series of responses to questions designed to assess their interests, skills, and mindset. Your task is to provide a comprehensive analysis of the student's mindset and qualities, recommending which computer science domain they should pursue and why.

    Begin your response with a friendly greeting using the student's name, such as "Hey [name], I hope you're doing great" (make this initial line as bold and higher font text). Then proceed with the analysis:
    
    ## Analysis:
   
    -Give 1 liner aobut each core competencies you could identify
   - rate them with their respective scores/10 for each one and BE HONEST WITH your scores wrt the answers given by ythe user
    -At lsat of this section, Also mention 2 weak spots with scores and a line aoubt it

    for each competency, also mention "you're in the top x % of students"
    
    ## Domain Recommendation:
    - Suggest two or more computer science domains that align with the student's strengths and interests.
    - Include a detailed justification for each recommended domain and also include links for resources to learn the domain from (free)
    the link font should be smaller and unbolded
    bold the statement that says "Here are some best FREE resources on the internet"
    
    ## Improvement Suggestions:
    - Identify areas where the student can improve, such as enhancing their logical reasoning or technical skills.
    - Provide practical advice on how they can develop these areas, such as engaging in specific projects, courses, or activities.
    
    ## Domain Inclination Score:
    - Provide a clearly formatted list of scores, with each domain on a new line in the following format:
      - **Software Engineering**: Score (e.g., 8/10)
      - **Data Science/Machine Learning**: Score (e.g., 7/10)
      - **Cybersecurity**: Score (e.g., 7/10)
    - Use consistent bold formatting for each domain name and score.

    Ensure that the analysis for each student is unique and personalized based on their responses. Your tone should be encouraging and supportive, helping the student feel confident in their path forward. Give extra spaces before and after headings to make them clear.`;

  const fullText = `${questionsAnswersString}\n\n${prompt}`;

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

  const getCacheKey = () => {
    // Create a unique cache key based on the user's responses
    return `techpath_analysis_${JSON.stringify(results)}_${user_details.name}`;
  };

  const getCachedResult = () => {
    const cacheKey = getCacheKey();
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      try {
        const parsedData = JSON.parse(cachedData);
        const currentTime = new Date().getTime();
        
        // Check if cache is less than 24 hours old
        if (currentTime - parsedData.timestamp < 24 * 60 * 60 * 1000) {
          return parsedData;
        } else {
          localStorage.removeItem(cacheKey);
        }
      } catch (error) {
        console.error('Error parsing cached data:', error);
        localStorage.removeItem(cacheKey);
      }
    }
    return null;
  };

  const run = async () => {
    try {
      setIsLoading(true);
      
      // Check for cached results first
      const cachedResult = getCachedResult();
      
      if (cachedResult) {
        console.log('Using cached result');
        setResponse(cachedResult.response);
        setScores(cachedResult.scores);
        setIsLoading(false);
        return;
      }

      console.log('Fetching new result');
      // If no cached result, fetch from API
      const res = await fetch(API_ENDPOINTS.GENERATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: fullText }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log('Received data:', data);

      if (!data.story) {
        throw new Error('No story in response');
      }

      const responseText = data.story;
      const extractedScores = extractScoresFromResponse(responseText);
      
      // Cache the results with a unique key
      const cacheData = {
        response: responseText,
        scores: extractedScores,
        timestamp: new Date().getTime()
      };
      
      localStorage.setItem(getCacheKey(), JSON.stringify(cacheData));
      
      setResponse(responseText);
      setScores(extractedScores);

    } catch (error) {
      console.error('Error fetching the analysis:', error);
      // Try to get any previous cache as fallback
      const cachedResult = getCachedResult();
      if (cachedResult) {
        setResponse(cachedResult.response);
        setScores(cachedResult.scores);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (results.length > 0 && user_details.name) {
      run();
    }
  }, [results, user_details.name]);

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

  useEffect(() => {
    const typewriterElement = document.getElementById('typewriter-response');
    if (response && typewriterElement) {
      typewriterElement.innerHTML = '';
      typeWriterEffect(typewriterElement, response, 5);
    }
  }, [response]);

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

  if (!results.length || !user_details.name) {
    return <div className="loading-message">No data available. Please try again.</div>;
  }

  return (
    <div className="mega">
      <div className="heading typewrite">
        <h2>Here's your analysis, {user_details.name.split(' ')[0]}</h2>
      </div>
      <div className="result_container">
        {isLoading ? (
          <div className="loading-message">
            {getCachedResult() ? 'Loading cached analysis...' : 'Analysing your responses, please wait...'}
          </div>
        ) : (
          <>
            <div id="typewriter-response" className="typewriter"></div>
            {scores.length > 0 && isTypingComplete && (
              <div className={`chart-container ${showChart ? 'show' : ''}`}>
                <Doughnut data={chartData} />
              </div>
            )}
          </>
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