import React, { Component } from 'react';

import Info from './Info';

import ResultShape from '../propTypes/result';
import { dollarify, datify } from '../utils';
import { ROOT } from '../secrets/constants';

import './Result.css';

class Result extends Component {
  static propTypes = {
    ...ResultShape,
  };

  get price() {
    const { price, price_drops } = this.props;

    return +(price_drops.length ? price_drops[0] : price);
  }

  render() {
    const {
      buyer_id,
      created_at,
      designer,
      followerno,
      id,
      size,
      sold_at,
      sold_price,
      title,
      user,
    } = this.props;

    return (
      <div className="Result">
        <Info
          label={`${designer.name} ${title}`}
          href={`${ROOT}listings/${id}`}
        />
        <Info
          label={user.username}
          href={`${ROOT}${user.username}`}
        />
        <div className="Result-body">
          <Info
            label="Size"
            body={size.toUpperCase()}
          />
          <Info
            label="Followers"
            body={followerno}
          />
          <Info
            label="Listed At"
            body={datify(created_at)}
          />
          <Info
            label="Sold At"
            body={datify(sold_at)}
            href={buyer_id ? `${ROOT}users/myitems/${buyer_id}` : null}
          />
          <Info
            label="List Price"
            body={dollarify(this.price)}
          />
          <Info
            label="Sold Price"
            body={dollarify(sold_price)}
            hidden={!sold_price}
          />
        </div>
      </div>
    );
  }
}

export default Result;
