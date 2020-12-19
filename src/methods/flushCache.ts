import type Teyvat from '..';
import type { FlushOptions } from '../types';

function flushCache(this: Teyvat, options?: FlushOptions) {
  if (!options) {
    this._charactersCache = new Map();
    this._weaponsCache = new Map();
    this._regionsCache = new Map();
    this._elementsCache = new Map();
    this._talentsCache = new Map();
    this._charactersProfilesCache = new Map();
  } else {
    for (const option of options) {
      switch (option) {
        case 'characters': {
          this._charactersCache = new Map();
          break;
        }
        case 'weapons': {
          this._weaponsCache = new Map();
          break;
        }
        case 'regions': {
          this._regionsCache = new Map();
          break;
        }
        case 'elements': {
          this._elementsCache = new Map();
          break;
        }
        case 'charactersProfiles': {
          this._charactersProfilesCache = new Map();
          break;
        }
      }
    }
  }
}

export default flushCache;
