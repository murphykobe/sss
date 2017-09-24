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

  renderResultItems() {
    const { results } = this.props;

    return results.map(result => <Result key={result.id} {...result}/>);
  }

  render() {
    return (
      <ToggleContainer label="Results" showOnMount>
        {this.renderResultItems()}
      </ToggleContainer>
    );
  }
}

export default ResultList;
