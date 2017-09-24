import React, { Component } from 'react';
import P from 'prop-types';
import { sum, mean } from 'lodash/fp';

import Loading from './Loading';
import Info from './Info';
import Result from './Result';

import ResultShape from '../propTypes/result';
import { dollarify, percentify } from '../utils';

import './Results.css';

class Results extends Component {
  static propTypes = {
    loading: P.bool,
    results: P.arrayOf(P.shape(ResultShape)),
  };

  state = {
    showSummary: false,
    showResults: true,
  };

  get listPrices() {
    const { results } = this.props;

    return results.map(({ price, price_drops }) => +(price_drops[0] || price));
  }

  get soldPrices() {
    const { results } = this.props;

    return results.map(({ sold_price }) => sold_price);
  }

  get avgListPrice() {
    return mean(this.listPrices);
  }

  get avgSoldPrice() {
    return mean(this.soldPrices);
  }

  get totalListPrice() {
    return sum(this.listPrices);
  }

  get totalSoldPrice() {
    return sum(this.soldPrices);
  }

  get avgDrop() {
    return (this.totalListPrice - this.totalSoldPrice) / this.totalListPrice;
  }

  renderSummary() {
    const { showSummary } = this.state;

    return (
      <div className="Results-section">
        <div>
          <label
            onClick={() => this.setState({ showSummary: !showSummary })}
          >
            {'Summary '}
            <i className={`fa ${showSummary ? 'fa-chevron-down' : 'fa-chevron-right' }`}/>
          </label>
        </div>
        {this.renderSummaryItems()}
      </div>
    );
  }

  renderSummaryItems() {
    const { results } = this.props;
    const { showSummary } = this.state;

    if (!showSummary) {
      return null;
    }

    return (
      <div>
        <Info
          label="Number of Results"
          body={results.length}
        />
        <Info
          label="Total List Price"
          body={dollarify(this.totalListPrice)}
        />
        <Info
          label="Total Sold Price"
          body={dollarify(this.totalSoldPrice)}
        />
        <Info
          label="Average List Price"
          body={dollarify(this.avgListPrice)}
        />
        <Info
          label="Average Sold Price"
          body={dollarify(this.avgSoldPrice)}
        />
        <Info
          label="Average Drop Amount"
          body={percentify(this.avgDrop)}
        />
      </div>
    );
  }

  renderResults() {
    const { showResults } = this.state;

    return (
      <div className="Results-section">
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

  renderResultItems() {
    const { results } = this.props;
    const { showResults } = this.state;

    if (!showResults) {
      return null;
    }

    return results.map(result => <Result key={result.id} {...result}/>);
  }

  render() {
    const { loading, results } = this.props;

    if (loading) {
      return <Loading/>;
    }

    if (!results) {
      return null;
    }

    if (!results.length) {
      return 'No results found. Try another search.'
    }

    return (
      <div className="Results">
        {this.renderSummary()}
        {this.renderResults()}
      </div>
    );
  }
}

export default Results;
