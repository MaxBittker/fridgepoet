import React, { PropTypes } from 'react';
import Immutable, { Record } from 'immutable';

import Spindle, { Update } from 'spindle-ui';


const propTypes = {
  text: PropTypes.string.isRequired,
  onEmit: PropTypes.fn
};

const Model = Record({
  word: Immutable.List([]),
  onClick: undefined,
});


const init = (props) =>
  Update({ model: Model().set('word', props.text).set('onClick', props.onEmit) })


const view = (model, dispatch, _) => {
  const word = model.get('word')
  const onClick = model.get('onClick')
  if(word==='line break' && !onClick)
    return (<br/>)
  return (<span style={{
    fontFamily: 'Georgia, serif',
    display: 'inline-block',
    border: '1px solid #222',
    margin: '5px 1px',
    padding: '2px 4px',
    backgroundColor: '#f5f5f5',
    boxShadow: '1px 1px 2px #111',
    transform: 'rotate(-1deg)'}}
    onClick={() => onClick(word)}>
    {word}
  </span>)
};


module.exports = Spindle('Tile', { propTypes, init, view });
