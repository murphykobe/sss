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
import { dateObjectify, datify, dollarify } from '../utils';
import designers, { filterOptions } from '../secrets/designers';

import './ChartList.css';

const accessors = {
  created_at: {
    scale: 'time',
    tickFormat: datify,
    label: 'Created At',
    parse: ({ created_at })  => dateObjectify(created_at),
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
  sold_at: {
    scale: 'time',
    tickFormat: datify,
    label: 'Sold At',
    parse: ({ sold_at })  => dateObjectify(sold_at),
  },
  sold_price: {
    scale: 'linear',
    tickFormat: dollarify,
    label: 'Sold Price',
    parse: 'sold_price',
  },
}

const accessorOptions = map(accessors, (v, k) => ({ label: v.label, value: k }));

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
      : accessorOptions.slice(0, 3);
  }

  get data() {
    const { results } = this.props;
    const { x, y, filteredDesigner } = this.state;

    const filteredResults = filteredDesigner
      ? results.filter(({ designer }) => designer.id === filteredDesigner.value )
      : results

    return filteredResults
      .filter(datum => datum[y])
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
