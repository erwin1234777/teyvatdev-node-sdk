import type { Teyvat } from '..';

function flushCache(this: Teyvat, options?: string) {
  if (!options) {
    this._charactersCache = new Map();
    this._weaponsCache = new Map();
    this._regionsCache = new Map();
    this._elementsCache = new Map();
    this._talentsCache = new Map();
    this._charactersProfilesCache = new Map();
  } else {
    switch (options) {
      //TODO ADD specific cache flushing here
      case '': {
        break;
      }
    }
  }
}

export default flushCache;
