import { useState, CSSProperties, useEffect, useRef } from 'react';
import './chat.css';
import axios from 'axios';
import config from '../../config.js';
import { getHotkeyHandler } from '@mantine/hooks';
import { Message } from 'renderer/utils';
import { MoodHappy, Send } from 'tabler-icons-react';

import Question from './components/Question';
import Answer from './components/Answer';
import { IconSend, IconTrash } from '@tabler/icons-react';

import {
  ActionIcon,
  Avatar,
  Button,
  Group,
  Modal,
  Paper,
  Stack,
  TextInput,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Block from './components/Block';

const override: CSSProperties = {
  display: 'block',
  margin: '0 auto',
  borderColor: 'red',
};

const styles = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  backgroundColor: 'background.paper',
  border: '2px solid #000',
  borderShadow: 24,
  p: 4,
};

function Chat() {
  const [queue, setQueue] = useState<Message[]>([]);
  const bottomRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [lastQuestion, setLastQuestion] = useState('');
  const [error, setError] = useState(false);
  const [value, setValue] = useState('');

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const handleMessageSend = () => {
    if (newMessage.trim() !== '') {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setNewMessage('');
    }
  };
  useEffect(() => {
    const chatData = localStorage.getItem('queue');
    if (chatData) {
      setQueue(JSON.parse(chatData)); // Parse the JSON string to retrieve the stored messages
    } else {
      setQueue([]);
    }
  }, []);

  const deleteDiscussion = () => {
    setQueue([]);
    localStorage.removeItem('queue');
    close();
  };

  const scrollToMyRef = () => {
    const scroll =
      bottomRef.current.scrollHeight - bottomRef.current.clientHeight;
    bottomRef.current.scrollTo(0, scroll);
  };

  const sendMessage = async () => {
    scrollToMyRef();
    setLastQuestion(input);
    window.scrollTo(0, document.documentElement.scrollHeight);

    setInput('');

    setIsLoading(true);
    setError(false);

    try {
      const response = await axios.post(
        `${config.REACT_APP_BACKEND_URL}/chat`,
        {
          question: input,
        }
      );
      const data = response.data;

      setQueue((prevQueue: Message[]) => [
        ...prevQueue,
        { question: input, answer: data.answer },
      ]);
    } catch (error) {
      setError(true);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (queue) {
      localStorage.setItem('queue', JSON.stringify(queue));
    }
  }, [queue]);

  const [opened, { open, close }] = useDisclosure(false);

  return (
     
    <Stack className="messages" p={0}>
      <div style={{ marginBottom: '1rem' }}>
        {messages.map((message, index) => (
          <Paper
            key={index}
            padding="xs"
            shadow="xs"
            style={{ marginBottom: '0.5rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {index % 2 !== 0 && (
                <Avatar
                  size="sm"
                  radius="xl"
                  src="https://placekitten.com/40/40"
                  alt="User Avatar"
                />
              )}
              <div style={{ marginLeft: index % 2 === 0 ? 'auto' : '0.5rem' }}>
                {message}
              </div>
              {index % 2 === 0 && (
                <Avatar
                  size="sm"
                  radius="xl"
                  src="https://placekitten.com/40/40"
                  alt="User Avatar"
                />
              )}
            </div>
          </Paper>
        ))}
      </div>
      <div className="button_send" style={{ display: 'flex' }}>
        <TextInput
          style={{ marginRight: '1rem' }}
          value={newMessage}
          onChange={(event) => setNewMessage(event.target.value)}
          placeholder="Type your message..."
        />
        <Button onClick={handleMessageSend} variant="outline">
          Send
        </Button>
      </div>
    </Stack>
  );
}

export default Chat;
