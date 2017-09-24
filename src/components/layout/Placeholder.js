import React from 'react';
import P from 'prop-types';

import './Placeholder.css';

const Placeholder = ({ message }) => (
  <div className="Placeholder">
    <h3>{message}</h3>
  </div>
);

Placeholder.propTypes = {
  message: P.string,
}

export default Placeholder;
