import React, { PureComponent } from 'react';
import P from 'prop-types';
import { compose, map, sum, mean } from 'lodash/fp';

import { Info, Row, ToggleContainer } from './layout';

import ResultShape from '../propTypes/result';
import { dollarify, percentify } from '../utils';

import './SummaryList.css';

class SummaryList extends PureComponent {
  static propTypes = {
    results: P.arrayOf(P.shape(ResultShape)),
    soldSearch: P.bool,
  };

  constructor(props) {
    super(props);

    this.listPrices = [];
    this.avgFollowers = 0;
    this.avgListPrice = 0;
    this.totalListPrice = 0;
    this.soldPrices = [];
    this.avgDaysToSell = 0;
    this.avgDrop = 0;
    this.avgSoldPrice = 0;
    this.totalSoldPrice = 0;

    this.calcSummaryStats();
  }

  componentDidUpdate(prevProps) {
    const { results } = this.props;

    if (results !== prevProps.results) {
      this.calcSummaryStats();
    }
  }

  calcSummaryStats() {
    const { results, soldSearch } = this.props;

    this.listPrices = map(({ price }) => price)(results);
    this.avgFollowers = compose(mean, map(({ followerno }) => followerno))(results);
    this.avgListPrice = mean(this.listPrices);
    this.totalListPrice = sum(this.listPrices);

    if (soldSearch) {
      this.soldPrices = map(({ sold_price }) => sold_price)(results);
      this.avgDaysToSell = compose(mean, map(({ days_to_sell }) => days_to_sell))(results);
      this.avgDrop = compose(mean, map(({ percent_dropped }) => percent_dropped))(results);
      this.avgSoldPrice = mean(this.soldPrices);
      this.totalSoldPrice = sum(this.soldPrices);
    }
  }

  render() {
    const { results, soldSearch } = this.props;

    return (
      <ToggleContainer label="Summary">
        <Row>
          <Info
            label="Results"
            body={results.length}
          />
          <Info
            label="Avg. Followers"
            body={(this.avgFollowers).toFixed(1)}
          />
          <Info
            label="Total List Price"
            body={dollarify(this.totalListPrice)}
          />
          <Info
            label="Avg. List Price"
            body={dollarify(this.avgListPrice)}
          />
        </Row>
        <Row hidden={!soldSearch}>
          <Info
            label="Avg. Days To Sell"
            body={(this.avgDaysToSell).toFixed(1)}
          />
          <Info
            label="Avg. Drop Amount"
            body={percentify(this.avgDrop)}
          />
          <Info
            label="Total Sold Price"
            body={dollarify(this.totalSoldPrice)}
          />
          <Info
            label="Avg. Sold Price"
            body={dollarify(this.avgSoldPrice)}
          />
        </Row>
      </ToggleContainer>
    );
  }
}

export default SummaryList;
