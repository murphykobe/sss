import P from 'prop-types';

export default {
  buyer_id: P.number,
  cover_photo: P.shape({
    url: P.string
  }).isRequired,
  created_at: P.string,
  description: P.string.isRequired,
  designer: P.shape({
    id: P.number.isRequired,
    name: P.string.isRequired,
  }).isRequired,
  followerno: P.number.isRequired,
  id: P.number.isRequired,
  price: P.number.isRequired,
  price_drops: P.arrayOf(P.oneOfType([P.string, P.number])).isRequired,
  size: P.string.isRequired,
  sold_at: P.string,
  sold_price: P.number,
  title: P.string.isRequired,
  user: P.shape({
    id: P.number.isRequired,
    username: P.string.isRequired,
  }).isRequired,
};