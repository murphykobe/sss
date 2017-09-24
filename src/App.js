import React, { Component } from 'react';

import Search from './components/Search';
import Results from './components/Results';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.handleSearchStart = this.handleSearchStart.bind(this);
    this.handleSearchEnd = this.handleSearchEnd.bind(this);
  }

  state = {
    loading: false,
    results: undefined,
    soldSearch: false,
  };

  handleSearchStart() {
    this.setState({ loading: true });
  }

  handleSearchEnd({ results, sold }) {
    this.setState({ loading: false, results, soldSearch: sold });
  }

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
          <div className="App-col flex-3">
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
