import React from 'react';
import P from 'prop-types';
import C from 'classnames';

import { Hidable } from '../decorator';

import './Row.css';

const Row = ({ children, halfWidth }) => (
  <div className={C('Row', halfWidth ? 'half-width' : 'full-width')}>
    {children}
  </div>
);

Row.propTypes = {
  children: P.node,
  halfWidth: P.bool,
};

export default Hidable(Row);
