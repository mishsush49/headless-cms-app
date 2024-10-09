import React, { useState } from 'react';
import ContentGeneration from './ContentGeneration';
import ShowAllContent from './ShowAllContent';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Content Management App</h1>
      </header>
      <div className="tabs">
        <button
          className={activeTab === 'contentGeneration' ? 'active' : ''}
          onClick={() => handleTabClick('contentGeneration')}
        >
          Content Generation
        </button>
        <button
          className={activeTab === 'showAllContent' ? 'active' : ''}
          onClick={() => handleTabClick('showAllContent')}
        >
          Show All Contents
        </button>
      </div>
      {activeTab === 'contentGeneration' && <ContentGeneration />}
      {activeTab === 'showAllContent' && <ShowAllContent />}
    </div>
  );
}

export default App;