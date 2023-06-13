import React from 'react';
import Question from './Question';
import Answer from './Answer';

function Block(props: { answer: string; question: string, metadata: object }) {
  return (
    <div className='flex flex-row'>
      <Question content={props.question} />
      <Answer content={props.answer} metadata={props.metadata} />
    </div>
  );
}

export default Block;
