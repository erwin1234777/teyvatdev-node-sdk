import { Teyvat } from '..';

function setRates(
  this: Teyvat,
  headers: {
    'x-ratelimit-remaining'?: string;
    'x-ratelimit-limit'?: string;
    'x-ratelimit-reset'?: string;
  }
) {
  this._hasRates = true;

  const {
    'x-ratelimit-remaining': remaining,
    'x-ratelimit-limit': limit,
    'x-ratelimit-reset': reset,
  } = headers;

  if (remaining) this._quota = Number(headers['x-ratelimit-remaining']);
  if (limit) this._quotaMax = Number(headers['x-ratelimit-limit']);
  if (reset) this._reset = Number(headers['x-ratelimit-reset']);
}

export default setRates;
