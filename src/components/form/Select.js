import React from 'react';
import VirtualizedSelect from 'react-virtualized-select';

import 'react-select/dist/react-select.css'
import 'react-virtualized/styles.css'
import 'react-virtualized-select/styles.css'
import './Select.css';

const Select = props => (
	<div className="React-Select">
		<VirtualizedSelect {...props}/>
	</div>
);

export default Select;