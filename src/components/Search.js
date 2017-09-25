import React, { Component } from 'react';
import P from 'prop-types';
import { omitBy } from 'lodash/fp';

import { Control, Select } from './form';
import { TextArray, ToggleContainer } from './layout';

import * as SearchActions from '../actions/search';
import options, { filterOptions } from '../secrets/designers';

import './Search.css';

const help = [
  'Search by seller and/or designer, or search without parameters to see all recently sold items.',
  'There is no way to filter out refunded items, so results may be slightly inaccurate.',
  'Up to 1000 results are searchable for any query.',
  <a key="link" href="https://www.github.com/timhwang21/sss/issues">Found a problem? File an issue on Github.</a>,
];

class Search extends Component {
  static propTypes = {
    onSearchStart: P.func,
    onSearchEnd: P.func,
  };

  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      sold: false,
      query: '',
      'user.id': '',
      'designers.id': undefined,
    }
  }

  get filteredState() {
    return omitBy(x => x === '' || x == null)(this.state);
  }

  get isValid() {
    return Object.keys(this.filteredState).length === 1;
  }

  handleSubmit() {
    const { onSearchStart, onSearchEnd } = this.props;

    onSearchStart();

    SearchActions.fetchSearch(this.filteredState).then(onSearchEnd);
  }

  render() {
    return (
      <form className="Search">
        <ToggleContainer label="Search" showOnMount>
          <Control label="Search Sold Listings" id="sold">
            <input
              id="sold"
              name="sold"
              type="checkbox"
              checked={this.state.sold}
              onChange={e => this.setState({ sold: e.target.checked })}
            />
          </Control>
          <Control label="Search Query">
            <input
              value={this.state.query}
              onChange={e => this.setState({ 'query': e.target.value })}
            />
          </Control>
          <Control label="Seller ID">
            <input
              type="number"
              value={this.state['user.id']}
              onChange={e => this.setState({ 'user.id': e.target.value })}
            />
          </Control>
          <Control label="Designer">
            <Select
              options={options}
              filterOptions={filterOptions}
              value={this.state['designers.id']}
              onChange={value => this.setState({ 'designers.id': value ? value.value : undefined })}
            />
          </Control>
          <Control label="">
            <button type="button" onClick={this.handleSubmit}>Search</button>
          </Control>
        </ToggleContainer>
        <ToggleContainer label="Help">
          <TextArray text={help}/>
        </ToggleContainer>
      </form>
    );
  }
}

export default Search;
