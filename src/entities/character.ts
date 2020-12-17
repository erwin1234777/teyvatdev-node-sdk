import type { Character } from '@teyvatdev/types';
import type { BaseOptions } from '../types';
import type { Teyvat } from '..';

import setRates from '../methods/setRates';
import get from '../methods/get';
import { AxiosResponse } from 'axios';

async function getCharacter(
  this: Teyvat,
  name: string,
  /**
   * Options:
   *
   */
  options?: BaseOptions
): Promise<Character | undefined> {
  // TODO: Cache logic can be abstracted to a helper
  //checking if cache has that character
  if (this._charactersCache.has(name) && !options)
    return this._charactersCache.get(name)! as Character;

  //checking for quota, if its lower than 4, wait until next reset
  if (this._quota < 4 && this._hasRates)
    await this._retry(Math.ceil(this._reset) - Math.ceil(Date.now() / 1000));

  const res: AxiosResponse<Character> = await get.bind(this)('character', {
    name,
  });

  if (res) {
    setRates.bind(this);

    //if data has been returned (aka not null) and there are no custom options, set cache
    if ((!options && res.data) || options?.cache)
      this._charactersCache.set(name, res.data);

    return res.data;
  }

  return;
}

async function getCharacters(
  this: Teyvat,
  /**
   * Options:
   *
   */
  options?: BaseOptions
): Promise<Character[] | undefined> {
  // TODO As above
  // Ensures that if theres already been a search on _charactersCache that it saves up on a request;
  if (this._charactersCache.has(null) && !options)
    return this._charactersCache.get(null)! as Character[];

  //quota checker, if quota is lower than 4, await for next reset before attempting it.
  if (this._quota < 4)
    await this._retry(Math.ceil(this._reset) - Math.ceil(Date.now() / 1000));

  const res: AxiosResponse<Character[]> = await get.bind(this)('characters');

  if (res) {
    setRates.bind(this);

    //setting cache on normal request
    if ((!options && res.data) || options?.cache) {
      this._charactersCache.set(null, res.data as Character[]);
      for (const char of res.data) this._charactersCache.set(char.name, char);
    }

    return res.data;
  }

  return;
}

export { getCharacter, getCharacters };
