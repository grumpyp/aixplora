import { useState, useEffect, useRef } from 'react';
import './chat.css';
import axios from 'axios';
import config from '../../config.js';
import Question from './components/Question';
import Answer from './components/Answer';
import { IconSend, IconTrash } from '@tabler/icons-react';
import { Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Block from './components/Block';

type Message = {
  question: string;
  answer: string;
  isLoading: boolean;
};

function Chat() {
  const [queue, setQueue] = useState<Message[]>([]);
  const bottomRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [input, setInput] = useState('');

  useEffect(() => {
    const chatData = localStorage.getItem('queue');
    if (chatData) {
      setQueue(JSON.parse(chatData));
    } else {
      setQueue([]);
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [queue]);

  const deleteDiscussion = () => {
    setQueue([]);
    localStorage.removeItem('queue');
  };

  const sendMessage = async () => {
    const currentQuestion = input;
    setInput('');
    setIsLoading(true);
    setError(false);

    setQueue((prevQueue: Message[]) => [
      ...prevQueue,
      { question: currentQuestion, answer: '', isLoading: true },
    ]);

    try {
      const response = await axios.post(
        `${config.REACT_APP_BACKEND_URL}/chat`,
        {
          question: currentQuestion,
        }
      );
      const data = response.data;

      setQueue((prevQueue: Message[]) =>
        prevQueue.map((message) =>
          message.question === currentQuestion
            ? { question: currentQuestion, answer: data.answer, isLoading: false }
            : message
        )
      );
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
    <div className="chat_container">
      <div onClick={open} className="delete_discussion">
        <IconTrash color="white" />
      </div>
      <Modal.Root opened={opened} onClose={close}>
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Delete the discussion</Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body>
            <p>
              Are you sure you want to delete the discussion? this action is
              irreversible
            </p>
            <button
              onClick={deleteDiscussion}
              style={{ backgroundColor: 'red', color: 'white' }}
            >
              Delete
            </button>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
      <div className="discussion">
        {queue.map((message, index) => (
          <Block
            key={index}
            question={message.question}
            answer={message.answer}
            isLoading={message.isLoading}
          />
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="user_input">
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          placeholder="what is the meaning of life"
          type="text"
        />
        <div onClick={sendMessage} className="icon_send">
          <IconSend color="white" />
        </div>
      </div>
    </div>
  );
}

export default Chat;
