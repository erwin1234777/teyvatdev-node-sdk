import type { BaseOptions } from '../types';
import type { Teyvat } from '..';

import axios from 'axios';

async function get(
  this: Teyvat,
  endpoint: string,
  mainParam?: { [key: string]: string | number },
  options?: BaseOptions
) {
  try {
    return axios.get(`${this.base}${endpoint}`, {
      headers: {
        Authorization: 'Bearer ' + this._token,
      },
      params: {
        ...mainParam,
        ...options,
      },
    });
  } catch (err) {
    console.error(err);
    throw Error(err);
  }
}

export default get;
