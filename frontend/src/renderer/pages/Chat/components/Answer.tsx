import { CSSProperties, useEffect, useState } from 'react';
import '../chat.css';
import PulseLoader from 'react-spinners/PulseLoader';
import { IconCopy, IconClipboardCheck } from '@tabler/icons-react';
import logo from '../../../components/assets/AIxplora_logo_round.png';
import { Button, IconButton, Snackbar } from '@mui/material';
import React from 'react';

const override: CSSProperties = {
  display: 'block',
  margin: '0 auto',
  borderColor: 'red',
};

function Answer(props: { content: string; isLoading?: boolean, metadata: any[] }) {
  const [copied, setCopied] = useState(false);
  const [content, setContent] = useState('');

  let timeoutId: any;

  useEffect(() => {}, [content]);

  const copyText = () => {
    navigator.clipboard.writeText(props.content);
    setCopied(true); // Set copied to true immediately

    clearTimeout(timeoutId); // Clear any existing timeout
    timeoutId = setTimeout(() => {
      setCopied(false); // Set copied to false after 5 seconds
    }, 5000);
  };

  return (
    <div className="answer_ container">
      {props.isLoading ? (
        <></>
      ) : (
        <div onClick={copyText} className="copy_button">
          {copied  ? <IconClipboardCheck color='green'/> : <IconCopy />}
        </div>
      )}

      <div className="avatar">
        <img className="avatar_image" src={logo} alt="" />
      </div>
      <div className="content">
        {props.isLoading ? (
          <p className="paragraph_content">
            <PulseLoader
              color="#000"
              loading={props.isLoading}
              cssOverride={override}
              size={3}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </p>
        ) : (
          <div className="paragraph_content">
            <p>{props.content}</p>
            <b>References</b>
            {props.metadata.map((item: any, index: number) => {
              if (item.page) {
                return (
                  <div key={index}>
                      {item.page}</div>
                );
              } else {
                return null;
              }
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Answer;
