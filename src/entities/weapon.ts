import type { AxiosResponse } from 'axios';
import type { Weapon } from '@teyvatdev/types';

import type Teyvat from '..';
import type { BaseOptions } from '../types';
import setRates from '../methods/setRates';
import get from '../methods/get';

async function getWeapon(
  this: Teyvat,
  name: string,
  /**
   * Options:
   *
   */
  options?: BaseOptions
): Promise<Weapon | undefined> {
  // TODO: Cache logic can be abstracted to a helper
  //checking if cache has that weapon
  if (this._weaponsCache.has(name) && !options)
    return this._weaponsCache.get(name)! as Weapon;

  //checking for quota, if its lower than 4, wait until next reset
  if (this._quota < 4 && this._hasRates)
    await this._retry(Math.ceil(this._reset) - Math.ceil(Date.now() / 1000));

  const res: AxiosResponse<Weapon> | undefined = await get.bind(this)(
    'weapon',
    {
      name,
    }
  );

  if (res) {
    setRates.bind(this);

    //if data has been returned (aka not null) and there are no custom options, set cache
    if (this._cache && ((!options && res.data) || options?.cache))
      this._weaponsCache.set(name, res.data);

    return res.data;
  }

  return;
}

async function getWeapons(
  this: Teyvat,
  /**
   * Options:
   *
   */
  options?: BaseOptions
): Promise<Weapon[] | undefined> {
  // TODO As above
  // Ensures that if theres already been a search on _weaponsCache that it saves up on a request;
  if (this._weaponsCache.has(null) && !options)
    return this._weaponsCache.get(null)! as Weapon[];

  //quota checker, if quota is lower than 4, await for next reset before attempting it.
  if (this._quota < 4)
    await this._retry(Math.ceil(this._reset) - Math.ceil(Date.now() / 1000));

  const res: AxiosResponse<Weapon[]> | undefined = await get.bind(this)(
    'weapons'
  );

  if (res) {
    setRates.bind(this);

    //setting cache on normal request
    if (this._cache && ((!options && res.data) || options?.cache)) {
      this._weaponsCache.set(null, res.data as Weapon[]);
      for (const char of res.data) this._weaponsCache.set(char.name, char);
    }

    return res.data;
  }

  return;
}

export { getWeapon, getWeapons };
