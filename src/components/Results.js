import React, { Component } from 'react';
import P from 'prop-types';
import { map, sum, mean } from 'lodash/fp';

import Placeholder from './Placeholder';
import Info from './Info';
import ResultList from './ResultList';

import ResultShape from '../propTypes/result';
import { dollarify, percentify } from '../utils';

import './Results.css';

const calcListPrices = map(({ price, price_drops}) => +(price_drops[0] || price));
const calcSoldPrices = map(({ sold_price }) => sold_price);

class Results extends Component {
  static propTypes = {
    loading: P.bool,
    results: P.arrayOf(P.shape(ResultShape)),
    soldSearch: P.bool,
  };

  constructor(props) {
    super(props);

    this.state = {
      showSummary: false,
      showResults: true,
    };

    this.listPrices = 0;
    this.avgListPrice = 0;
    this.totalListPrice = 0;
    this.soldPrices = 0;
    this.avgSoldPrice = 0;
    this.totalSoldPrice = 0;
    this.avgDrop = 0;
  }

  componentWillReceiveProps(nextProps) {
    const { results } = this.props;

    if (results === nextProps.results) {
      return;
    }

    this.listPrices = calcListPrices(nextProps.results);
    this.avgListPrice = mean(this.listPrices);
    this.totalListPrice = sum(this.listPrices);

    if (nextProps.soldSearch) {
      this.soldPrices = calcSoldPrices(nextProps.results);
      this.avgSoldPrice = mean(this.soldPrices);
      this.totalSoldPrice = sum(this.soldPrices);
      this.avgDrop = (this.totalListPrice - this.totalSoldPrice) / this.totalListPrice;
    }
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
          hidden={!this.totalSoldPrice}
        />
        <Info
          label="Average List Price"
          body={dollarify(this.avgListPrice)}
        />
        <Info
          label="Average Sold Price"
          body={dollarify(this.avgSoldPrice)}
          hidden={!this.totalSoldPrice}
        />
        <Info
          label="Average Drop Amount"
          body={percentify(this.avgDrop)}
          hidden={!this.totalSoldPrice}
        />
      </div>
    );
  }

  render() {
    const { loading, results } = this.props;
    const { showResults } = this.state;

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
        {this.renderSummary()}
        <ResultList results={results} showResults={showResults}/>
      </div>
    );
  }
}

export default Results;
