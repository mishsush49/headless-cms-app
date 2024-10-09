import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function ContentGeneration() {
  const [playerName, setPlayerName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [generatedContent, setGeneratedContent] = useState({});
  const [isContentGenerated, setIsContentGenerated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishMessage, setPublishMessage] = useState('');

  const handleInputChange = (e) => {
    setPlayerName(e.target.value);
    setErrorMessage(''); // Clear any previous error messages
  };

  const handleContentChange = (e, field) => {
    setGeneratedContent({
      ...generatedContent,
      [field]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (!playerName.trim()) {
      setErrorMessage('Player name cannot be empty');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:5000/generate-content', {
        playerName: playerName.trim(),
      });
      const { generatedText } = response.data;
      const contentObject = JSON.parse(generatedText);
      setGeneratedContent(contentObject);
      setIsContentGenerated(true);
      setErrorMessage(''); // Clear any previous error messages
    } catch (error) {
      console.error('Error generating content:', error);
      setErrorMessage('Failed to generate content. Please try again.');
      setGeneratedContent({}); // Clear any previous generated content
      setIsContentGenerated(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublishContent = async () => {
    setIsPublishing(true);
    try {
      const response = await axios.post('http://localhost:5000/publish-content', {
        content: generatedContent,
      });
      console.log('Content published:', response.data);
      setPublishMessage('Content published successfully!');
      setTimeout(() => {
        setPublishMessage('');
      }, 5000);
    } catch (error) {
      console.error('Error publishing content:', error);
      setErrorMessage('Failed to publish content. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="content">
      <input
        type="text"
        placeholder="Enter Player Name"
        value={playerName}
        onChange={handleInputChange}
      />
      <button onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
      {errorMessage && <p className="error">{errorMessage}</p>}
      {isContentGenerated && (
        <div className="generated-content">
          <h2>Generated Content</h2>
          <table>
            <tbody>
              <tr>
                <td><label>Player Name:</label></td>
                <td><input type="text" value={generatedContent.PlayerName} onChange={(e) => handleContentChange(e, 'PlayerName')} /></td>
              </tr>
              <tr>
                <td><label>Description:</label></td>
                <td><textarea value={generatedContent.Description} onChange={(e) => handleContentChange(e, 'Description')} /></td>
              </tr>
              <tr>
                <td><label>Country:</label></td>
                <td><input type="text" value={generatedContent.Country} onChange={(e) => handleContentChange(e, 'Country')} /></td>
              </tr>
            </tbody>
          </table>
          <button onClick={handlePublishContent} disabled={isPublishing}>
            {isPublishing ? 'Publishing...' : 'Publish Content'}
          </button>
          {publishMessage && <p className="success">{publishMessage}</p>}
        </div>
      )}
    </div>
  );
}

export default ContentGeneration;