import type { AxiosResponse } from 'axios';
import type { Region } from '@teyvatdev/types';

import type Teyvat from '..';
import type { BaseOptions } from '../types';
import setRates from '../methods/setRates';
import get from '../methods/get';

async function getRegion(
  this: Teyvat,
  name: string,
  /**
   * Options:
   *
   */
  options?: BaseOptions
): Promise<Region | undefined> {
  // TODO: Cache logic can be abstracted to a helper
  //checking if cache has that region
  if (this._regionsCache.has(name) && !options)
    return this._regionsCache.get(name)! as Region;

  //checking for quota, if its lower than 4, wait until next reset
  if (this._quota < 4 && this._hasRates)
    await this._retry(Math.ceil(this._reset) - Math.ceil(Date.now() / 1000));

  const res: AxiosResponse<Region> | undefined = await get.bind(this)(
    'region',
    {
      name,
    }
  );

  if (res) {
    setRates.bind(this);

    //if data has been returned (aka not null) and there are no custom options, set cache
    if (this._cache && ((!options && res.data) || options?.cache))
      this._regionsCache.set(name, res.data);

    return res.data;
  }

  return;
}

async function getRegions(
  this: Teyvat,
  /**
   * Options:
   *
   */
  options?: BaseOptions
): Promise<Region[] | undefined> {
  // TODO As above
  // Ensures that if theres already been a search on _regionsCache that it saves up on a request;
  if (this._regionsCache.has(null) && !options)
    return this._regionsCache.get(null)! as Region[];

  //quota checker, if quota is lower than 4, await for next reset before attempting it.
  if (this._quota < 4)
    await this._retry(Math.ceil(this._reset) - Math.ceil(Date.now() / 1000));

  const res: AxiosResponse<Region[]> | undefined = await get.bind(this)(
    'regions'
  );

  if (res) {
    setRates.bind(this);

    //setting cache on normal request
    if (this._cache && ((!options && res.data) || options?.cache)) {
      this._regionsCache.set(null, res.data as Region[]);
      for (const char of res.data) this._regionsCache.set(char.name, char);
    }

    return res.data;
  }

  return;
}

export { getRegion, getRegions };
