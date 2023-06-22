import React from 'react';
import '../chat.css';

function Question(props: { content: string }) {
  return (
    <div className="question_ container">
      <div className="avatar">
        <img className="avatar_image" src="https://images.unsplash.com/photo-1582561833407-b95380302a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=755&q=80" alt="" />
      </div>
      <div className="content">
        <p className="question_content paragraph_content">{props.content}</p>
      </div>
    </div>
  );
}

export default Question;
