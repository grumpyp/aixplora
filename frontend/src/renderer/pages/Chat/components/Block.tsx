import React from 'react';
import Question from './Question';
import Answer from './Answer';

function Block(props: { answer: string; question: string; isLoading: boolean }) {
  return (
    <div className='flex flex-row'>
      <Question content={props.question} />
      <Answer content={props.answer} isLoading={props.isLoading} />
    </div>
  );
}

export default Block;
