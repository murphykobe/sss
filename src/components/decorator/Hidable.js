import React from 'react';
import P from 'prop-types';

/* eslint-disable react/display-name, react/prop-types */
const Hidable = Component => ({ hidden, ...props }) => hidden ? null : <Component {...props}/>

Hidable.propTypes = {
  hidden: P.bool,
};

export default Hidable;