import { useState, useEffect } from 'react';
import '../chat.css';
import PulseLoader from 'react-spinners/PulseLoader';
import { IconCopy, IconClipboardCheck } from '@tabler/icons-react';
import logo from '../../../components/assets/AIxplora_logo_round.jpg';

function Answer(props: { content: string; isLoading?: boolean }) {
  const [copied, setCopied] = useState(false);
  const [content, setContent] = useState('');

  useEffect(() => {}, [content]);

  const copyText = () => {
    navigator.clipboard.writeText(props.content);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 5000);
  };

  return (
    <div className="answer_ container">
      {props.isLoading ? (
        <></>
      ) : (
        <div onClick={copyText} className="copy_button">
          {copied ? <IconClipboardCheck color="green" /> : <IconCopy />}
        </div>
      )}
      <div className="avatar">
        <img className="avatar_image" src={logo} alt="" />
      </div>
      <div className="content">
        {props.isLoading ? (
          <PulseLoader
            color="#000"
            loading={props.isLoading}
            size={3}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        ) : (
          <p className="paragraph_content">{props.content}</p>
        )}
      </div>
    </div>
  );
}

export default Answer;
