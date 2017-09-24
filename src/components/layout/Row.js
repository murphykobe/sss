import React from 'react';
import P from 'prop-types';

import { Hidable } from '../decorator';

import './Row.css';

const Row = ({ children }) => (
  <div className="Row">
    {children}
  </div>
);

Row.propTypes = {
  children: P.node,
};

export default Hidable(Row);
