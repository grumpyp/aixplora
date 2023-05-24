import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config.js';
import {TextInput, Button} from '@mantine/core';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    const question = input;
    const response = await axios.post(`${config.REACT_APP_BACKEND_URL}/chat`, {
      question: question
    });
    const data = response.data;
    // your response: {"question":"How old are you?","answer":"I don't know."}
    setMessages([...messages, {text: data.question, sender: 'user'}, {text: data.answer, sender: 'bot'}]);
    setInput("");
  };

  return (
    <div>
      {messages.map((message, index) => (
        <div key={index} className={message.sender}>
          <p>{message.text}</p>
        </div>
      ))}
      <TextInput mt="sm" label="Your question?" placeholder="What's AIxplora?" value={input} onChange={e => setInput(e.target.value)}/>
      <Button type="submit" mt="sm" onClick={sendMessage}>
          Ask
      </Button>
    </div>
  );
};

export default Chat;
