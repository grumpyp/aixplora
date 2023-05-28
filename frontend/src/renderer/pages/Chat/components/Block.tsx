import React from 'react';
import Question from './Question';
import Answer from './Answer';

function Block(props: { answer: string; question: string }) {
  return (
    <div>
      <Question content={props.question} />
      <Answer content={props.answer} />
    </div>
  );
}

export default Block;
