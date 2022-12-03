import Head from 'next/head';
import Image from 'next/image';
import buildspaceLogo from '../assets/buildspace-logo.png';
import React from 'react';
import { useState } from 'react';

const Home = () => {

const [userInput, setUserInput] = useState('');
const [apiOutput, setApiOutput] = useState('')
const [isGenerating, setIsGenerating] = useState(false)

const callGenerateEndpoint = async () => {
  setIsGenerating(true);
  
  console.log("Calling OpenAI...")
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userInput }),
  });

  const data = await response.json();
  const { output } = data;
  console.log("OpenAI replied...", output.text)

  setApiOutput(`${output}`);
  setIsGenerating(false);
}
const onUserChangedText = (event) => {
  console.log(event.target.value);
  setUserInput(event.target.value);
};

//on tab press, access apiOutput text and find first instance of square brackets
const onTabPress = (event) => {
  if (event.key === 'Tab') {
    event.preventDefault();
    const apiOutputText = apiOutput;
    const firstBracketIndex = apiOutputText.indexOf('[');
    const lastBracketIndex = apiOutputText.indexOf(']');
    //highlight text between first and last bracket including brackets
    const highlightedText = apiOutputText.substring(firstBracketIndex, lastBracketIndex + 1);
    
    // if tab again, remove brackets from highlighted text and hihglight next set of brackets
    const newHighlightedText = highlightedText.replace('[', '').replace(']', '');
    //replace highlighted text with new highlighted text
    const newApiOutputText = apiOutputText.replace(highlightedText, newHighlightedText);
    //set new api output text
    setApiOutput(newApiOutputText);


  }
}
  return (
    <div className="root">
      <Head>
        <title>GPT-3 Writer | buildspace</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Noteify</h1>
          </div>
          <div className="header-subtitle">
            <h2>Take the stress out of medical documentation with our AI powered writing assistant</h2>
          </div>
        </div>
      </div>
      <div className="prompt-container">
      <textarea
          className="prompt-box"
          placeholder="Chief complaint goes here"
          value={userInput}
          onChange={onUserChangedText}/>;
      </div>
      <div className="prompt-buttons">
  <a
    className={isGenerating ? 'generate-button loading' : 'generate-button'}
    onClick={callGenerateEndpoint}
  >
    <div className="generate">
    {isGenerating ? <span class="loader"></span> : <p>Generate</p>}
    </div>
  </a>
</div>
    {/* New code I added here */}
    {apiOutput && (
  <div className="output">
    <div className="output-header-container">
      <div className="output-header">
        <h3>Output</h3>
      </div>
    </div>
    <div className="output-content" >
      <p>{apiOutput}</p>
    </div>
  </div>
)}
      
    </div>
  );
};

export default Home;
