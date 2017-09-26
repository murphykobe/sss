import React, { PureComponent } from 'react';
import P from 'prop-types';
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryTheme,
  createContainer,
} from 'victory';
import { compose, get, minBy, maxBy } from 'lodash/fp';
import { map } from 'lodash';

import Result from './Result';
import { Row, ToggleContainer } from './layout';
import { Control, Select } from './form';

import ResultShape from '../propTypes/result';
import { datify, dollarify, percentify } from '../utils';
import designers, { filterOptions } from '../secrets/designers';

import './ChartList.css';

const ChartContainer = createContainer('zoom', 'voronoi');

const accessors = {
  created_at: {
    scale: 'time',
    tickFormat: datify,
    label: 'Created At',
  },
  followerno: {
    scale: 'linear',
    tickFormat: x => x,
    label: 'Followers',
  },
  price: {
    scale: 'linear',
    tickFormat: dollarify,
    label: 'Start Price',
  },
  price_drops: {
    scale: 'linear',
    tickFormat: x => x,
    label: 'Number of Drops',
  },
  sold_at: {
    scale: 'time',
    tickFormat: datify,
    label: 'Sold At',
  },
  sold_price: {
    scale: 'linear',
    tickFormat: dollarify,
    label: 'Sold Price',
  },
  amount_dropped: {
    scale: 'linear',
    tickFormat: dollarify,
    label: 'Amount Dropped',
  },
  percent_dropped: {
    scale: 'linear',
    tickFormat: percentify,
    label: 'Percent Dropped',
  },
  days_to_sell: {
    scale: 'linear',
    tickFormat: x => x,
    label: 'Days to Sell',
  },
}

const accessorOptions = map(accessors, (v, k) => ({ label: v.label, value: k }));

const windowSizeOptions = [50, 100, 500, 1000].map(size => ({ label: size, value: size }));

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
      windowSize: 50,
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
      .filter(datum => datum[y] != null)
      .sort((a, b) => a[x] - b[x])
  }

  get domainX() {
    const { results } = this.props;
    const { x, windowSize } = this.state;

    // TODO: Refactor this to use a constant amount; easier to calculate and more predictable

    if (results.length <= windowSize) {
      return;
    }

    const endIdx = results.length - 1;
    const startIdx = results.length - 1 - windowSize;

    return accessors[x].scale === 'time'
      ? [results[endIdx][x], results[startIdx][x]]
      : [results[startIdx][x], results[endIdx][x]];
  }

  get domainY() {
    const { results } = this.props;
    const { y } = this.state;

    const lowerBound = compose(
      get(y),
      minBy(y),
    )(results);

    const upperBound = compose(
      get(y),
      maxBy(y),
    )(results);

    return [lowerBound, upperBound];
  }

  handleMouseOver = activePoints =>
    activePoints && activePoints.length && this.setState({ active: activePoints[0] });

  renderChartItems() {
    const { x, y } = this.state;

    return (
      <VictoryChart
        containerComponent={
          <ChartContainer
            allowZoom={false}
            zoomDomain={{ x: this.domainX, y: this.domainY }}
            radius={25}
            onActivated={this.handleMouseOver}
          />
        }
        scale={{ x: accessors[x].scale, y: accessors[y].scale }}
        theme={VictoryTheme.material}
        height={300}
        width={800}
        padding={{ left: 85, bottom: 45, top: 10, right: 10 }}
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
            axisLabel: { fontWeight: 700, padding: 70 },
          }}
        />
        <VictoryLine
          animate={{ duration: 1000 }}
          data={this.data}
          x={x}
          y={y}
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
    const { x, y, filteredDesigner, windowSize } = this.state;

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
          <Control label="Window Size">
            <Select
              options={windowSizeOptions}
              value={windowSize}
              onChange={({ value }) => this.setState({ windowSize: value })}
              noClear
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
