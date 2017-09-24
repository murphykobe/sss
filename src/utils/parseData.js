import { map } from 'lodash/fp';

import { dateObjectify } from '../utils';

const DAY_LENGTH = 1000 * 60 * 60 * 24;

const parseData = d => {
  const created_at = dateObjectify(d.created_at);
  const sold_at = dateObjectify(d.sold_at);
  const price = +(d.price_drops[0] || d.price);
  const amount_dropped = price - d.sold_price;

  return {
    ...d,
    created_at,
    sold_at,
    price,
    price_drops: d.price_drops.length ? d.price_drops.length - 1 : 0,
    amount_dropped,
    percent_dropped: amount_dropped / price,
    days_to_sell: Math.round((sold_at - created_at) / DAY_LENGTH),
  }
};

export default map(parseData);