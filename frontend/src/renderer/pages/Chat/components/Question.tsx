import React from 'react';
import '../chat.css';
import logo from '../../../components/assets/AIxplora_logo_round.jpg';

function Question(props: { content: string }) {
  return (
    <div className="question_ container">
      <div className="avatar">
        <img className="avatar_image" src={logo} alt="" />
      </div>
      <div className="content">
        <p className="question_content paragraph_content">{props.content}</p>
      </div>
    </div>
  );
}

export default Question;
