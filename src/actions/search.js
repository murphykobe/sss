import qs from 'qs';

import { SEARCH, QUERY, getRoute, getFilters } from '../secrets';

const headers = new Headers({
  'Content-Type': 'application/x-www-form-urlencoded',
});

export const fetchSearch = ({ sold, ...filters }, page = 0, currentResults = []) => {
  const url = SEARCH + getRoute(sold) + QUERY;
  const options = {
    method: 'POST',
    headers,
    body: JSON.stringify({
      params: qs.stringify({
        query: '',
        hitsPerPage: 1000,
        page,
      }).concat(`&filters=${getFilters(filters)}`)
    })
  };

  return fetch(url, options).then(resp => resp.json()).then(({ hits }) => {
    const totalResults = currentResults.concat(hits);

    // Throttle at 5 pages to avoid accidental DDOS
    return (hits.length < 100 || page === 5)
      ? { results: totalResults, sold }
      : fetchSearch({ sold, ...filters}, page + 1, totalResults);
  });
};