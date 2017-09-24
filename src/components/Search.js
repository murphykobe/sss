import React, { Component } from 'react';
import P from 'prop-types';
import { omitBy } from 'lodash/fp';
import Select from './Select';

import * as SearchActions from '../actions/search';
import Info from './Info';
import options, { filterOptions } from '../secrets/designers';

import './Search.css';

const Help = (
  <div className="Search-help">
    <div>
      {'Search by any combination of seller, buyer, or designer.'}
    </div>
    <div>
      {'If a sold listing has buyer info, it will be linked in the \'Sold At\' section.'}
    </div>
    <div>
      {'Not all listings have buyer info.'}
    </div>
    <div>
      {'There is no way to filter out refunded items, so results may be slightly inaccurate.'}
    </div>
  </div>
);

const Control = ({ children, label, id }) => (
  <div className="Search-control">
    <label htmlFor={id}>{label}</label>
    {children}
  </div>
);

Control.propTypes = {
  children: P.node,
  label: P.string,
  id: P.string,
};

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
      'user.id': '',
      buyer_id: '',
      'designers.id': undefined,
    }
  }

  get filteredState() {
    return omitBy(x => x === '' || x == null)(this.state);
  }

  get hasBuyerId() {
    return this.state.buyer_id !== '';
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
        <Info
          label="Info"
          body={Help}
        />
        <Control label="Search Sold Listings" id="sold">
          <input
            id="sold"
            name="sold"
            type="checkbox"
            disabled={this.hasBuyerId}
            checked={this.state.sold}
            onChange={e => this.setState({ sold: e.target.checked })}
          />
        </Control>
        <Control label="Seller ID">
          <input
            type="number"
            value={this.state['user.id']}
            onChange={e => this.setState({ 'user.id': e.target.value })}
          />
        </Control>
        <Control label="Buyer ID">
          <input
            type="number"
            value={this.state.buyer_id}
            onChange={e => this.setState({ sold: e.target.value !== '', buyer_id: e.target.value })}
          />
        </Control>
        <Control label="Designer ID">
          <Select
            options={options}
            filterOptions={filterOptions}
            value={this.state['designers.id']}
            onChange={value => this.setState({ 'designers.id': value ? value.value : undefined })}
          />
        </Control>
        <button type="button" disabled={this.isValid} onClick={this.handleSubmit}>Submit</button>
      </form>
    );
  }
}

export default Search;
