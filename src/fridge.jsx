import React from 'react';
import Immutable, { Record } from 'immutable';
import { Union } from 'results';
import Spindle, { Update } from 'spindle-ui';
import Tile from './tile.jsx';
import dictionary from './wordlist.js'

const selectRandom = ()=>{
  return dictionary[Math.random()*dictionary.length|0];
}

const Action = Union({
  Add: {},
  Remove: null,
});

const stopwords = Immutable.OrderedSet(
  ['a','i','is','an','you','the','and','this','.', ',', '!', '?','—', 'line break'])

const Model = Record({
  words: Immutable.List([]),
  options: Immutable.OrderedSet(Immutable.Range(0,25).map(selectRandom)),
});

const init = () =>
  Update({ model: Model() });

const update = (action, model) => Action.match(action, {
  Add: (word) => Update({
        model: model
        .update('words', list => list.push({
          id: list.size,
          word: word.toString()
        }))
        .update('options', list => list.delete(word).add(selectRandom()))}),
  Remove: () =>
    Update({ model: model.update('words', list => list.pop()) }),
});

const view = (model, dispatch) => (
  <div style={{
      height: '90vh',
      display: 'flex',
      flexDirection:'column',
      justifyContent:'space-between',
    }}>
    <div style={{
        width: '350px',
        margin: 'auto',
       }}>
    {model.get('words').map(item => (
      <Tile text={item.word} key={item.id} />
    )).toArray()}
    </div>
    <p>
        {model.get('options').merge(stopwords).map(word => (
          <Tile key={word} text={word} onEmit={dispatch.Add}/>
        )).toArray()}
      <Tile text='backspace' onEmit={dispatch.Remove}/>
    </p>
  </div>
);


export default Spindle('Fridge',
  { Action, init, update, view });

/////////////////////////////////////////////////////
