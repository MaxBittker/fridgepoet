import React from 'react';
import Immutable, { Record } from 'immutable';
import { Union } from 'results';
import Spindle, { Update } from 'spindle-ui';
import Tile from './tile.jsx';
import markovModel from '../chain.json'

const selectRandom = (dict) => {
  const dictionary = Object.keys(dict)
  return dictionary[Math.random()*dictionary.length|0];
}

const sample = (dict, n) => Immutable.Range(0,n).map(()=>selectRandom(dict))

const predictions = (word, n) => {
  console.log(word)
  const options = markovModel[word]
  if(options!==undefined){
    return Immutable.OrderedSet( sample( options,n))
  }
  return Immutable.OrderedSet(sample(markovModel, n))
}

const Action = Union({
  Add: {},
  Remove: null,
});

const stopwords = Immutable.OrderedSet(
  ['a','s','i','is','me','an','ing','ly','ed','you','the','and','this','.', ',', '!', '?','—', 'line break'])

const Model = Record({
  words: Immutable.List([]),
  options: Immutable.OrderedSet(sample(markovModel, 25)),
});

const init = () =>
  Update({ model: Model() });

const update = (action, model) => Action.match(action, {
  Add: (word) =>
    Update({
        model: model
        .update('words', list => list.push({
          id: list.size,
          word: word.toString()
        }))
        .update('options', list => list.delete(word).takeLast(25).merge(predictions(word, 4)))}),
  Remove: () =>
    Update({ model: model.update('words', list => list.pop()) }),
});

const view = (model, dispatch) => (
  <div style={{
      height: '90vh',
      display: 'flex',
      flexDirection:'column',
      justifyContent:'space-around',
    }}>
    <div style={{
        width: '350px',
        maxWidth: '100%',
        margin: 'auto',
       }}>
    {model.get('words').map(item => (
      <Tile text={item.word} key={item.id} />
    )).toArray()}
    </div>
    <p style={{
        display:'flex',
        flexWrap: 'wrap',
        flexDirection: 'row-reverse',
        justifyContent: 'flex-end'
      }}>
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
