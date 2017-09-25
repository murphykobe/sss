import P from 'prop-types';

export default {
  cover_photo: P.shape({
    url: P.string
  }).isRequired,
  created_at: P.any,
  description: P.string.isRequired,
  designer: P.shape({
    id: P.number.isRequired,
    name: P.string.isRequired,
  }).isRequired,
  followerno: P.number.isRequired,
  id: P.number.isRequired,
  price: P.number.isRequired,
  price_drops: P.number.isRequired,
  size: P.string.isRequired,
  sold_at: P.any,
  sold_price: P.number,
  title: P.string.isRequired,
  user: P.shape({
    id: P.number.isRequired,
    username: P.string.isRequired,
  }).isRequired,
  // computed properties
  amount_dropped: P.number,
  percent_dropped: P.number,
  days_to_sell: P.number,
};