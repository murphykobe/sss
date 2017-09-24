import React, { PureComponent } from 'react';
import P from 'prop-types';
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryTheme,
  VictoryVoronoiContainer,
} from 'victory';
import { map } from 'lodash';

import Result from './Result';
import { Row, ToggleContainer } from './layout';
import { Control, Select } from './form';

import ResultShape from '../propTypes/result';
import { dateObjectify, datify, dollarify, percentify } from '../utils';
import designers, { filterOptions } from '../secrets/designers';

import './ChartList.css';

const accessors = {
  created_at: {
    scale: 'time',
    tickFormat: datify,
    label: 'Created At',
    parse: 'created_at',
  },
  followerno: {
    scale: 'linear',
    tickFormat: x => x,
    label: 'Followers',
    parse: 'followerno',
  },
  price: {
    scale: 'linear',
    tickFormat: dollarify,
    label: 'Start Price',
    parse: 'price',
  },
  price_drops: {
    scale: 'linear',
    tickFormat: x => x,
    label: 'Number of Drops',
    parse: 'price_drops',
  },
  sold_at: {
    scale: 'time',
    tickFormat: datify,
    label: 'Sold At',
    parse: 'sold_at',
  },
  sold_price: {
    scale: 'linear',
    tickFormat: dollarify,
    label: 'Sold Price',
    parse: 'sold_price',
  },
  amount_dropped: {
    scale: 'linear',
    tickFormat: dollarify,
    label: 'Amount Dropped',
    parse: 'amount_dropped',
  },
  percent_dropped: {
    scale: 'linear',
    tickFormat: percentify,
    label: 'Percent Dropped',
    parse: 'percent_dropped',
  },
  days_to_sell: {
    scale: 'linear',
    tickFormat: x => x,
    label: 'Days to Sell',
    parse: 'days_to_sell',
  },
}

const accessorOptions = map(accessors, (v, k) => ({ label: v.label, value: k }));

const DAY_LENGTH = 1000 * 60 * 60 * 24;

const addComputedProperties = d => {
  const created_at = dateObjectify(d.created_at);
  const sold_at = dateObjectify(d.sold_at);
  const price = +(d.price_drops[0] || d.price);
  const amount_dropped = price - d.sold_price;

  return {
    ...d,
    created_at,
    sold_at,
    price,
    price_drops: d.price_drops.length,
    amount_dropped,
    percent_dropped: amount_dropped / price,
    days_to_sell: Math.round((sold_at - created_at) / DAY_LENGTH),
  }
};

class ChartList extends PureComponent {
  static propTypes = {
    results: P.arrayOf(P.shape(ResultShape)),
    soldSearch: P.bool,
  };

  constructor(props) {
    super(props);

    const { soldSearch } = props;

    this.state = {
      x: soldSearch ? 'sold_at' : 'created_at',
      y: soldSearch ? 'sold_price' : 'price',
      active: undefined,
      filteredDesigner: undefined,
    }
  }

  get options() {
    const { soldSearch } = this.props;

    return soldSearch
      ? accessorOptions
      : accessorOptions.slice(0, 4);
  }

  get data() {
    const { results } = this.props;
    const { x, y, filteredDesigner } = this.state;

    const filteredResults = filteredDesigner
      ? results.filter(({ designer }) => designer.id === filteredDesigner.value )
      : results

    return filteredResults
      .map(addComputedProperties)
      .filter(datum => datum[y] != null)
      .sort((a, b) => a[x] - b[x])
  }

  handleMouseOver = (e, { activePoints }) =>
    activePoints && activePoints.length && this.setState({ active: activePoints[0] });

  renderChartItems() {
    const { x, y } = this.state;

    return (
      <VictoryChart
        containerComponent={<VictoryVoronoiContainer/>}
        scale={{ x: accessors[x].scale, y: accessors[y].scale }}
        theme={VictoryTheme.material}
        height={300}
        width={800}
        padding={{ left: 80, bottom: 45, top: 10, right: 10 }}
        events={[{
          target: 'parent',
          eventHandlers: {
            onMouseOver: this.handleMouseOver
          }
        }]}
      >
        <VictoryAxis
          tickFormat={accessors[x].tickFormat}
          label={accessors[x].label}
          style={{
            axisLabel: { fontWeight: 700, padding: 30 },
          }}
        />
        <VictoryAxis
          dependentAxis
          tickFormat={accessors[y].tickFormat}
          label={accessors[y].label}
          style={{
            axisLabel: { fontWeight: 700, padding: 60 },
          }}
        />
        <VictoryLine
          animate={{
            duration: 500,
          }}
          data={this.data}
          x={accessors[x].parse}
          y={accessors[y].parse}
        />
      </VictoryChart>
    );
  }

  renderHoveredItem() {
    const { active } = this.state;

    return active
      ? <Result {...active}/>
      : null;
  }

  render() {
    const { x, y, filteredDesigner } = this.state;

    return (
      <ToggleContainer label="Analyze">
        <Row>
          <Control label="X axis">
            <Select
              options={this.options}
              value={x}
              onChange={({ value }) => this.setState({ x: value})}
              noClear
            />
          </Control>
          <Control label="Y axis">
            <Select
              options={this.options}
              value={y}
              onChange={({ value }) => this.setState({ y: value})}
              noClear
            />
          </Control>
          <Control label="Designer">
            <Select
              options={designers}
              filterOptions={filterOptions}
              value={filteredDesigner}
              onChange={filteredDesigner => this.setState({ filteredDesigner })}
            />
          </Control>
        </Row>
        {this.renderChartItems()}
        {this.renderHoveredItem()}
      </ToggleContainer>
    );
  }
}

export default ChartList;
