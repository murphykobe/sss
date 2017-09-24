import React, { PureComponent } from 'react';
import P from 'prop-types';

import Result from './Result';
import ResultShape from '../propTypes/result';

import './ResultList.css';

class Results extends PureComponent {
  static propTypes = {
    results: P.arrayOf(P.shape(ResultShape)),
    showResults: P.bool,
  };

  renderResultItems() {
    const { results, showResults } = this.props;

    if (!showResults) {
      return null;
    }

    return results.map(result => <Result key={result.id} {...result}/>);
  }

  render() {
    const { showResults } = this.props;

    return (
      <div className="ResultList">
        <div>
          <label
            onClick={() => this.setState({ showResults: !showResults })}
          >
            {'Results '}
            <i className={`fa ${showResults ? 'fa-chevron-down' : 'fa-chevron-right' }`}/>
          </label>
        </div>
        {this.renderResultItems()}
      </div>
    );
  }
}

export default Results;
