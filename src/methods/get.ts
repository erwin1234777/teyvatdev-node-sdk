import axios from 'axios';

import type Teyvat from '..';
import type { BaseOptions } from '../types';

async function get(
  this: Teyvat,
  endpoint: string,
  params?: { [key: string]: string | number },
  options?: BaseOptions
) {
  try {
    return axios.get(`${this.base}${endpoint}`, {
      headers: {
        Authorization: 'Bearer ' + this._token,
      },
      params: {
        ...params,
        ...options,
      },
    });
  } catch (err) {
    this._errorHandler(err);
    return;
  }
}

export default get;
