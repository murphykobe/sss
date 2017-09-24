import React from 'react';
import P from 'prop-types';
import VirtualizedSelect from 'react-virtualized-select';

import 'react-select/dist/react-select.css'
import 'react-virtualized/styles.css'
import 'react-virtualized-select/styles.css'
import './Select.css';

const noClearProps = {
  backspaceRemoves: false,
  clearable: false,
  deleteRemoves: false,
};

const Select = ({ noClear, ...props }) => (
  <div className="React-Select">
    <VirtualizedSelect {...props} {...(noClear ? noClearProps : {})}/>
  </div>
);

Select.propTypes = {
  noClear: P.bool,
}

export default Select;