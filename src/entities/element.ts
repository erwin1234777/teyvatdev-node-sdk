import type { AxiosResponse } from 'axios';
import type { Element } from '@teyvatdev/types';

import type Teyvat from '..';
import type { BaseOptions } from '../types';
import setRates from '../methods/setRates';
import get from '../methods/get';

async function getElement(
  this: Teyvat,
  name: string,
  /**
   * Options:
   *
   */
  options?: BaseOptions
): Promise<Element | undefined> {
  // TODO: Cache logic can be abstracted to a helper
  //checking if cache has that element
  if (this._elementsCache.has(name) && !options)
    return this._elementsCache.get(name)! as Element;

  //checking for quota, if its lower than 4, wait until next reset
  if (this._quota < 4 && this._hasRates)
    await this._retry(Math.ceil(this._reset) - Math.ceil(Date.now() / 1000));

  const res: AxiosResponse<Element> | undefined = await get.bind(this)(
    'element',
    {
      name,
    }
  );

  if (res) {
    setRates.bind(this);

    //if data has been returned (aka not null) and there are no custom options, set cache
    if (this._cache && ((!options && res.data) || options?.cache))
      this._elementsCache.set(name, res.data);

    return res.data;
  }

  return;
}

async function getElements(
  this: Teyvat,
  /**
   * Options:
   *
   */
  options?: BaseOptions
): Promise<Element[] | undefined> {
  // TODO As above
  // Ensures that if theres already been a search on _elementsCache that it saves up on a request;
  if (this._elementsCache.has(null) && !options)
    return this._elementsCache.get(null)! as Element[];

  //quota checker, if quota is lower than 4, await for next reset before attempting it.
  if (this._quota < 4)
    await this._retry(Math.ceil(this._reset) - Math.ceil(Date.now() / 1000));

  const res: AxiosResponse<Element[]> | undefined = await get.bind(this)(
    'elements'
  );

  if (res) {
    setRates.bind(this);

    //setting cache on normal request
    if (this._cache && ((!options && res.data) || options?.cache)) {
      this._elementsCache.set(null, res.data as Element[]);
      for (const char of res.data) this._elementsCache.set(char.name, char);
    }

    return res.data;
  }

  return;
}

export { getElement, getElements };
