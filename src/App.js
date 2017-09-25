import React, { Component } from 'react';
import C from 'classnames';

import Search from './components/Search';
import Results from './components/Results';

import './App.css';

class App extends Component {
  state = {
    loading: false,
    results: undefined,
    soldSearch: false,
  };

  get resultsClassName() {
    const { loading, results } = this.state;

    return C('App-col', (loading || results) ? 'flex-3' : 'no-width no-margin');
  }

  handleSearchStart = () => this.setState({ loading: true });

  handleSearchEnd = ({ results, sold: soldSearch }) => this.setState({
    loading: false,
    results,
    soldSearch,
  });

  render() {
    const { loading, results, soldSearch } = this.state;

    return (
      <div className="App">
        <div className="App-header">
          <h2>Super Simple Search</h2>
        </div>
        <div className="App-body mobile-col">
          <div className="App-col flex-1">
            <Search
              onSearchStart={this.handleSearchStart}
              onSearchEnd={this.handleSearchEnd}
            />
          </div>
          <div className={this.resultsClassName}>
            <Results
              loading={loading}
              results={results}
              soldSearch={soldSearch}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
