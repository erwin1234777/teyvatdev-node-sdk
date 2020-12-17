import type { CharacterProfile } from '@teyvatdev/types';
import type { BaseOptions, CUID } from '../types';
import type { Teyvat } from '..';

import setRates from '../methods/setRates';
import get from '../methods/get';
import { AxiosResponse } from 'axios';

async function getCharacterProfile(
  this: Teyvat,
  id: CUID,
  /**
   * Options:
   *
   */
  options?: BaseOptions
): Promise<CharacterProfile | undefined> {
  // TODO: Cache logic can be abstracted to a helper
  //checking if cache has that character
  if (this._charactersProfilesCache.has(id) && !options)
    return this._charactersProfilesCache.get(id)! as CharacterProfile;

  //checking for quota, if its lower than 4, wait until next reset
  if (this._quota < 4 && this._hasRates)
    await this._retry(Math.ceil(this._reset) - Math.ceil(Date.now() / 1000));

  const res: AxiosResponse<CharacterProfile> = await get.bind(this)(
    'characterProfile',
    {
      id,
    }
  );

  if (res) {
    setRates.bind(this);

    //if data has been returned (aka not null) and there are no custom options, set cache
    if ((!options && res.data) || options?.cache)
      this._charactersProfilesCache.set(id, res.data);

    return res.data;
  }

  return;
}

async function getCharacterProfiles(
  this: Teyvat,
  /**
   * Options:
   *
   */
  options?: BaseOptions
): Promise<CharacterProfile[] | undefined> {
  // TODO As above
  // Ensures that if theres already been a search on _charactersCache that it saves up on a request;
  if (this._charactersProfilesCache.has(null) && !options)
    return this._charactersProfilesCache.get(null)! as CharacterProfile[];

  //quota checker, if quota is lower than 4, await for next reset before attempting it.
  if (this._quota < 4)
    await this._retry(Math.ceil(this._reset) - Math.ceil(Date.now() / 1000));

  const res: AxiosResponse<CharacterProfile[]> = await get.bind(this)(
    'characterProfiles'
  );

  if (res) {
    setRates.bind(this);

    //setting cache on normal request
    if ((!options && res.data) || options?.cache) {
      this._charactersProfilesCache.set(null, res.data as CharacterProfile[]);
      for (const char of res.data)
        this._charactersProfilesCache.set(char.id, char);
    }

    return res.data;
  }

  return;
}

export { getCharacterProfile, getCharacterProfiles };
