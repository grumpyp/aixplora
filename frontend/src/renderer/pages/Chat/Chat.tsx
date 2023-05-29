import { useState, CSSProperties, useEffect, useRef } from 'react';
import './chat.css';
import axios from 'axios';
import config from '../../config.js';
import { Message } from 'renderer/utils';
import Question from './components/Question';
import Answer from './components/Answer';
import { IconSend, IconTrash } from '@tabler/icons-react';

import { Modal } from '@mantine/core';
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
  const [input, setInput] = useState('');

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
      <div ref={bottomRef} className="discussion">
        {queue.map((message, index) => (
          <Block question={message.question} answer={message.answer} />
        ))}
        {isLoading ? (
          <div className="temp_question">
            {' '}
            <Question content={lastQuestion} /> <Answer isLoading={true} />
          </div>
        ) : null}
      </div>
      <div className="user_input">
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
    </div>
  );
}

export default Chat;
