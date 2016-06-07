import React, { PropTypes } from 'react';
import Immutable, { Record } from 'immutable';

import Spindle, { Update } from 'spindle-ui';


const propTypes = {
  text: PropTypes.string.isRequired,
  onEmit: PropTypes.fn
};

const Model = Record({
  word: Immutable.List([]),
  isControl: false,
  onClick: undefined,
});


const init = (props) =>
  Update({ model: Model()
    .set('word', props.text)
    .set('onClick', props.onEmit)
    .set('isControl', props.isControl) })


const view = (model, dispatch, _) => {
  const word = model.get('word')
  const onClick = model.get('onClick')
  const isControl = model.get('isControl')
  if(word==='line break' && !isControl)
    return (<br/>)
  return (<span style={{
    cursor:'pointer',
    fontFamily: 'Georgia, serif',
    display: 'inline-block',
    border: '1px solid #222',
    margin: '5px 1px',
    padding: '2px 4px',
    fontSize: '22px',
    backgroundColor: '#f5f5f5',
    boxShadow: '1px 1px 2px #111',
    transform: `rotate(${(Math.random()*.4+.8).toString()}deg)`}}
    onClick={() => onClick(word)}>
    {word}
  </span>)
};


module.exports = Spindle('Tile', { propTypes, init, view });
