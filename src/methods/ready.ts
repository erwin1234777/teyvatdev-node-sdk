import axios from 'axios';
import type { Teyvat } from '..';

async function flushCache(this: Teyvat) {
  // Dummy request
  // TODO: Update this once a ratelimit check endpoint is given
  const fetchRates = await axios.get(this.base + 'character', {
    headers: {
      Authorization: 'Bearer ' + this._token,
    },
    params: {
      name: 'Amber',
    },
  });

  if (fetchRates) {
    if (fetchRates.headers['x-ratelimit-remaining'] !== undefined)
      this._quota = fetchRates.headers['x-ratelimit-remaining'];

    if (fetchRates.headers['x-ratelimit-limit'] !== undefined)
      this._quotaMax = fetchRates.headers['x-ratelimit-limit'];

    if (fetchRates.headers['x-ratelimit-reset'] !== undefined)
      this._reset = fetchRates.headers['x-ratelimit-reset'];
  }
}

export default flushCache;
