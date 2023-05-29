import { CSSProperties } from 'react';
import '../chat.css';
import PulseLoader from 'react-spinners/PulseLoader';

import logo from '../../../components/assets/AIxplora_logo_round.jpg';

const override: CSSProperties = {
  display: 'block',
  margin: '0 auto',
  borderColor: 'red',
};

function Answer(props: { content?: string; isLoading?: boolean }) {
  return (
    <div className="answer_ container">
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
          <p className="paragraph_content">{props.content}</p>
        )}
      </div>
    </div>
  );
}

export default Answer;
