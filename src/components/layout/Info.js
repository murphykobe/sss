import React from 'react';
import P from 'prop-types';

import { Hidable } from '../decorator';

import './Info.css';

const Info = ({ label, body, href }) => (
  <div className="Info">
    <label>{href ? <a href={href}>{label}</a> : label}</label>
    <div>{body}</div>
  </div>
)

Info.propTypes = {
  label: P.string.isRequired,
  body: P.oneOfType([P.string, P.number, P.node]),
  href: P.string,
};

export default Hidable(Info);
