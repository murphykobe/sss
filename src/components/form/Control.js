import React from 'react';
import P from 'prop-types';

import './Control.css';

const Control = ({ children, label, id }) => (
  <div className="Control">
    <label htmlFor={id}>{label}</label>
    {children}
  </div>
);

Control.propTypes = {
  children: P.node,
  label: P.string,
  id: P.string,
};

export default Control;