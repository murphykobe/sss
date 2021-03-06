import React, { PureComponent } from 'react';
import P from 'prop-types';

import { Hidable } from '../decorator';

import './ToggleContainer.css';

class ToggleContainer extends PureComponent {
  static propTypes = {
    label: P.string.isRequired,
    showOnMount: P.bool,
    children: P.node,
  };

  state = {
    show: this.props.showOnMount,
  };

  toggle = () => this.setState({ show: !this.state.show });

  render() {
    const { label, children } = this.props;
    const { show } = this.state;

    return (
      <div className="ToggleContainer">
        <h3 className="ToggleContainer-label" onClick={this.toggle}>
          <span>{label}</span>
          <i className={`fa ${show ? 'fa-chevron-down' : 'fa-chevron-right' }`}/>
        </h3>
        {show ? children : null}
      </div>
    );
  }
}

export default Hidable(ToggleContainer);
