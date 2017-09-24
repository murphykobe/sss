import React, { Component } from 'react';
import P from 'prop-types';
import { omitBy } from 'lodash/fp';

import * as SearchActions from '../actions/search';
import Info from './Info';

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
      'designers.id': '',
    }
  }

  get filteredState() {
    return omitBy(x => x === '')(this.state);
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
          <input
            type="number"
            value={this.state['designers.id']}
            onChange={e => this.setState({ 'designers.id': e.target.value })}
          />
        </Control>
        <button type="button" disabled={this.isValid} onClick={this.handleSubmit}>Submit</button>
      </form>
    );
  }
}

export default Search;
