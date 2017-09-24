import React, { Component } from 'react';
import P from 'prop-types';
import { Placeholder } from './layout';

import ResultList from './ResultList';
import SummaryList from './SummaryList';

import ResultShape from '../propTypes/result';

import './Results.css';

class Results extends Component {
  static propTypes = {
    loading: P.bool,
    results: P.arrayOf(P.shape(ResultShape)),
    soldSearch: P.bool,
  };

  render() {
    const { loading, results, soldSearch } = this.props;

    if (loading) {
      return <Placeholder message="Loading..."/>;
    }

    if (!results) {
      return null;
    }

    if (!results.length) {
      return <Placeholder message="No results found. Try another search."/>
    }

    return (
      <div className="Results">
        <SummaryList results={results} soldSearch={soldSearch}/>
        <ResultList results={results}/>
      </div>
    );
  }
}

export default Results;
