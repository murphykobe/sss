import qs from 'qs';

import { SEARCH, QUERY, getRoute, getFilters } from '../secrets/constants';
import { parseData } from '../utils';

const headers = new Headers({
  'Content-Type': 'application/x-www-form-urlencoded',
});

export const fetchSearch = ({ sold, ...filters }, currentResults = []) => {
  const url = SEARCH + getRoute(sold) + QUERY;
  const options = {
    method: 'POST',
    headers,
    body: JSON.stringify({
      params: qs.stringify({
        query: '',
        hitsPerPage: 1000,
        page: 0,
      }).concat(`&filters=${getFilters(filters)}`)
    })
  };

  return fetch(url, options)
    .then(resp => resp.json())
    .then(({ hits }) => ({ results: parseData(currentResults.concat(hits)), sold }));
};