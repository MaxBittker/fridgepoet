import React from 'react';
import Immutable, { Record } from 'immutable';
import { Union } from 'results';
import Spindle, { Update } from 'spindle-ui';
import Tile from './tile.jsx';

import classical from '../models/classical.json'
import eliot from '../models/eliot.json'
import emily from '../models/emily.json'
import garcia from '../models/garcia.json'
import langston from '../models/langston.json'
import william from '../models/william.json'

const modelOptions = Immutable.OrderedMap({
    "emily dickinson":emily,
    "classical poetry": classical,
    "ts eliot": eliot,
    "gabriel garcía":garcia,
    "langston hughes":langston,
    "william shakespeare":william
})

const selectRandom = dict => {
  const dictionary = Object.keys(dict)
  const sampleEntry = dict[dictionary[0]]
  if(typeof sampleEntry === "object"){
    return dictionary[Math.random()*dictionary.length|0];
  } else {
    return selectWeighted(dict)
  }
}

const selectWeighted = weightedDict => {
        let sum = 0
        for(var w in weightedDict) {
          sum += weightedDict[w]
        }
        let n = Math.random()*sum;

        for(var key in weightedDict) {
            n -= weightedDict[key]
            if(n <= 0){
              return key
            }
        }
        throw new Error('Exceeded threshold. Something is very wrong.');
}


const sample = (dict, n) =>
  Immutable.Range(0,n).map(()=>selectRandom(dict))

const predictions = (chain, word, n) => {
  const options = chain[word]
  if(options!==undefined){
    return Immutable.OrderedSet( sample( options,n))
  }
  return Immutable.OrderedSet(sample(chain, 1))
}

const Action = Union({
  Add: null,
  Remove: null,
  SetModel: null,
});


const readHash = () => {
  if (location.hash) {
    return JSON.parse(b64DecodeUnicode(location.hash.substring(1)));
  } else {
    return [];
  }
}

const stopwords = Immutable.OrderedSet(
  // ['a','s','i','is','me','an','ing','ly','ed','you','the','and','this',
  ['s','.', ',', '!', '?','—', 'line break'])

const limit = 9
const Model = Record({
  words: Immutable.List(readHash()),
  options: Immutable.OrderedSet(sample(classical, limit)),
  chain: 'classical poetry',
});

const init = () =>
  Update({ model: Model() });

const update = (action, model) => Action.match(action, {
  Add: word => {
    const newModel = Update({
       model: model
       .update('words', list => list.push({
         id: list.size,
         word: word.toString()
       }))
       .update('options', list => list.delete(word)
           .takeLast(limit)
           .merge(predictions(modelOptions.get(model.get('chain')), word, 4)))
     })
    location.hash = '#' + b64EncodeUnicode(JSON.stringify(newModel.get('model').get('words').toArray()));
    return newModel
    },

  Remove: () =>
    Update({ model: model.update('words', list => list.pop()) }),

  SetModel: e =>
    Update({model: model
                .set('chain', e.target.value)
                .set('options', Immutable.OrderedSet(sample(classical, limit)))})
});

const view = (model, dispatch) => (
  <div style={{
      minHeight: '90vh',
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
      <Tile text={item.word} key={item.id} onEmit={dispatch.Add}/>
    )).toArray()}
    </div>
    <p style={{
        display:'flex',
        flexWrap: 'wrap',
        flexDirection: 'row-reverse',
        justifyContent: 'flex-end'
      }}>
        {model.get('options').merge(stopwords).map(word => (
          <Tile key={word} text={word} isControl={true} onEmit={dispatch.Add}/>
        )).toArray()}
      <Tile text='backspace' onEmit={dispatch.Remove}/>
    </p>
    <select style={{
      width: '280px',
      cursor:'pointer',
      fontFamily: 'Georgia, serif',
      display: 'inline-block',
      border: '1px solid #222',
      margin: '5px 1px',
      padding: '2px 4px',
      fontSize: '22px',
      backgroundColor: '#f5f5f5',
      boxShadow: '1px 1px 2px #111',
      transform: 'rotate(-.8deg)'}}
      onChange={dispatch.SetModel}>
      {modelOptions.keySeq().map(item => (
        <option key={item} value={item}> {item} </option>
      ))}
    </select>
  </div>
);

export default Spindle('Fridge',
  { Action, init, update, view });


  function b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
      return String.fromCharCode('0x' + p1);
    }));
  }

  function b64DecodeUnicode(str) {
    return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }
