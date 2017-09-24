import React, { PureComponent } from 'react';
import P from 'prop-types';

import Result from './Result';
import { ToggleContainer } from './layout';

import ResultShape from '../propTypes/result';

import './ResultList.css';

class ResultList extends PureComponent {
  static propTypes = {
    results: P.arrayOf(P.shape(ResultShape)),
  };

  render() {
    const { results } = this.props;

    return (
      <ToggleContainer label="Results" showOnMount>
        {results.map(result => <Result key={result.id} {...result}/>)}
      </ToggleContainer>
    );
  }
}

export default ResultList;
