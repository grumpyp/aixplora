import React, { useEffect, useState } from 'react';
import { IconSend } from '@tabler/icons-react';
import './graph.css';
import axios from 'axios';
import config from 'renderer/config';
import {implementGraph} from './index'

function Graph() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastQuestion, setLastQuestion] = useState('');
  const [lastAnswer, setLastAnswer] = useState('');
  const [error, setError] = useState(false);
   const [input, setInput] = useState('');

   useEffect(() => {
    const graphData = localStorage.getItem('graph');
    if (graphData) {
        setLastAnswer(JSON.parse(graphData)); // Parse the JSON string to retrieve the stored messages
    } else {
        setLastAnswer('');
    }
  }, []);

  const sendMessage = async () => {
    setLastQuestion(input);
    window.scrollTo(0, document.documentElement.scrollHeight);

    setInput('');

    setIsLoading(true);
    setError(false);
     let finalMessage = `Retrieve all the main ideas and sub-ideas with their titles and descriptions
         for each idea about the following question ${input} in JSON format. Each sub-idea should have be nested 
         within its parent main idea, the result should be in this format {
           {"main_idea": {
            "title": "some title",
            "description": "some description",
            "sub_idea": [{
              "title": "some title",
              "description": "some description",
              "sub_idea": null
            }]}}. { "topic": "quantum chaos", "format": "json", 
         "include_title": true, "include_description": true, "include_subideas": true, "nest_subideas": true }`;

    try {
      const response = await axios.post(
        `${config.REACT_APP_BACKEND_URL}/chat`,
        {
          question: finalMessage,
        }
      );
      const data = response.data;
      setLastAnswer(data.answer)
      
    } catch (error) {
      setError(true);
    }
    setIsLoading(false);
    implementGraph()
   };

  return (
    <div className="graph">
      <div className="user_input_graph">
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          placeholder="what is the meaning of life"
          type="text"
          name="question"
          id="question"
          onKeyDown={(event) => {
            if (input.length != 0 || isLoading) {
              if (event.key === 'Enter') {
                sendMessage();
              }
            }
          }}
        />
        <div
          onClick={() => {
            if (input.length != 0 || isLoading) {
              sendMessage();
            }
          }}
          className="question_submit"
        >
          <IconSend />
        </div>
      </div>
      <div className="graph">
        <div id="search-input"></div>
         <div id="suggestions"></div>
        <div id="sigma-container">
        </div>
      </div>
    </div>
  );
}

export default Graph;
