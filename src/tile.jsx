import React, { PropTypes } from 'react';
import Spindle, { Update } from 'spindle-ui';


const propTypes = {
  text: PropTypes.string.isRequired,
};


const view = (_, __, props) => (
  <span style={{
    fontFamily: 'Georgia, serif',
    display: 'inline-block',
    border: '1px solid #222',
    margin: '5px 1px',
    padding: '2px 4px',
    backgroundColor: '#f5f5f5',
    boxShadow: '1px 1px 2px #111' }}
    onClick={props.onEmit}>
    {props.text}
  </span>
);


module.exports = Spindle('Tile', { propTypes, view });
