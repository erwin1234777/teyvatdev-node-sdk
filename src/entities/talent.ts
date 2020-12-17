import type { Talent } from '@teyvatdev/types';
import type { BaseOptions } from '../types';
import type { Teyvat } from '..';

import setRates from '../methods/setRates';
import get from '../methods/get';
import { AxiosResponse } from 'axios';

async function getTalent(
  this: Teyvat,
  name: string,
  /**
   * Options:
   *
   */
  options?: BaseOptions
): Promise<Talent | undefined> {
  // TODO: Cache logic can be abstracted to a helper
  //checking if cache has that talent
  if (this._talentsCache.has(name) && !options)
    return this._talentsCache.get(name)! as Talent;

  //checking for quota, if its lower than 4, wait until next reset
  if (this._quota < 4 && this._hasRates)
    await this._retry(Math.ceil(this._reset) - Math.ceil(Date.now() / 1000));

  const res: AxiosResponse<Talent> = await get.bind(this)('talent', {
    name,
  });

  if (res) {
    setRates.bind(this);

    //if data has been returned (aka not null) and there are no custom options, set cache
    if ((!options && res.data) || options?.cache)
      this._talentsCache.set(name, res.data);

    return res.data;
  }

  return;
}

async function getTalents(
  this: Teyvat,
  /**
   * Options:
   *
   */
  options?: BaseOptions
): Promise<Talent[] | undefined> {
  // TODO As above
  // Ensures that if theres already been a search on _talentsCache that it saves up on a request;
  if (this._talentsCache.has(null) && !options)
    return this._talentsCache.get(null)! as Talent[];

  //quota checker, if quota is lower than 4, await for next reset before attempting it.
  if (this._quota < 4)
    await this._retry(Math.ceil(this._reset) - Math.ceil(Date.now() / 1000));

  const res: AxiosResponse<Talent[]> = await get.bind(this)('talents');

  if (res) {
    setRates.bind(this);

    //setting cache on normal request
    if ((!options && res.data) || options?.cache) {
      this._talentsCache.set(null, res.data as Talent[]);
      for (const char of res.data) this._talentsCache.set(char.name, char);
    }

    return res.data;
  }

  return;
}

export { getTalent, getTalents };
