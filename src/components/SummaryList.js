import React, { PureComponent } from 'react';
import P from 'prop-types';
import { map, sum, mean } from 'lodash/fp';

import { Info, Row, ToggleContainer } from './layout';

import ResultShape from '../propTypes/result';
import { dollarify, percentify } from '../utils';

import './SummaryList.css';

const calcListPrices = map(({ price, price_drops}) => +(price_drops[0] || price));
const calcSoldPrices = map(({ sold_price }) => sold_price);

class SummaryList extends PureComponent {
  static propTypes = {
    results: P.arrayOf(P.shape(ResultShape)),
    soldSearch: P.bool,
  };

  constructor(props) {
    super(props);

    this.listPrices = 0;
    this.avgListPrice = 0;
    this.totalListPrice = 0;
    this.soldPrices = 0;
    this.avgSoldPrice = 0;
    this.totalSoldPrice = 0;
    this.avgDrop = 0;

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

    this.listPrices = calcListPrices(results);
    this.avgListPrice = mean(this.listPrices);
    this.totalListPrice = sum(this.listPrices);

    if (soldSearch) {
      this.soldPrices = calcSoldPrices(results);
      this.avgSoldPrice = mean(this.soldPrices);
      this.totalSoldPrice = sum(this.soldPrices);
      this.avgDrop = (this.totalListPrice - this.totalSoldPrice) / this.totalListPrice;
    }
  }

  renderSummaryItems() {
    const { results } = this.props;

    return (
      <div>
        <Row>
          <Info
            label="Number of Results"
            body={results.length}
          />
          <Info
            label="Total List Price"
            body={dollarify(this.totalListPrice)}
          />
          <Info
            label="Average List Price"
            body={dollarify(this.avgListPrice)}
          />
        </Row>
        <Row>
          <Info
            label="Total Sold Price"
            body={dollarify(this.totalSoldPrice)}
            hidden={!this.totalSoldPrice}
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
        </Row>
      </div>
    );
  }

  render() {
    return (
      <ToggleContainer label="Summary">
        {this.renderSummaryItems()}
      </ToggleContainer>
    );
  }
}

export default SummaryList;
