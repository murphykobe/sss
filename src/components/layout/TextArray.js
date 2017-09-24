import React from 'react';
import P from 'prop-types';

import { Hidable } from '../decorator';

import './TextArray.css';

const TextArray = ({ text }) => (
  <div className="TextArray">
    {text.map((string, i) => <div key={i}>{string}</div>)}
  </div>
);

TextArray.propTypes = {
  text: P.array,
};

export default Hidable(TextArray);
