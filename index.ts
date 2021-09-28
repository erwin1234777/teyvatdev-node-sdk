import Axios, { AxiosResponse } from 'axios';
import { Agent } from 'https';
import * as teyvatdev from '@teyvatdev/types';
import * as async from 'async';
import { EventEmitter } from 'events';
let agent = new Agent({ keepAlive: true });
const axios = Axios.create({
  timeout: 60000,
  //httpsAgent: agent,
});
abstract class baseOptions {
  /**
   * skips index, example skip 5, returns past the 5th element
   *
   */
  skip?: number;
  /**
   * example {take:5};
   * same as max, returned amount
   *
   */
  take?: number;
  /**
   * example ?include={"talents": true}
   * which will include the connected talents table of the chars returned
   */
  include?: { [key: string]: any };
  /**
   * Used internally for aggressive caching
   */
  cache?: boolean;
  select?: { [key: string]: any };
}

type flushOptions =
  | 'all'
  | [
      'characters'?,
      'weapons'?,
      'regions'?,
      'elements'?,
      'talents'?,
      'charactersProfiles'?
    ];
interface TeyvatConstructorOptions {
  /**
   * Caches all endpoint entries on startup. Default: false
   */
  aggressive?: boolean;
  /**
   * Enables/Disables caching on the library. Default: true
   *
   */
  cache?: boolean;
  /**
   * Enables/Disables silent mode, no errors or logs will be thrown. Default: false
   */
  silent?: boolean;
}
type CUID = string;
type TeyvatToken = string;

/**
 * ## TS Example
 *
 * ```
 * import { Teyvat } from '../TeyvatLib/index';
 * const tey = new Teyvat('Token Here');
 *
 * tey.getCharacter('Amber').then((data) => {
 * console.log(data);
 *  //Expected, Amber stats or undefined
 * })
 * ```
 *
 *  ## JS Example
 *
 * ```
 * const Tey = require('../TeyvatLib/index');
 * const tey = new Tey('Token Here');
 *
 * tey.getCharacter('Amber').then((data) => {
 * console.log(data);
 *  //Expected, Amber stats or undefined
 * })
 *
 * ```
 * ## All examples
 * ```
 * let Amber = await tey.getCharacter('Amber');
 * let Characters = await tey.getCharacters();
 * let FavoniuSword = await tey.getWeapon('10');
 * let Weapons = await tey.getWeapons();
 * let Mondstad = await tey.getRegion('ckifg54kg0000vf0iclar2lp6');
 * let Regions = await tey.getRegions();
 * let Anemo = await tey.getElement('ckifg2oxf0000n30i3k0e3s7m');
 * let Elements = await tey.getElements();
 * let GoldTalent = await tey.getTalent('1');
 * let Talents = await tey.getTalents();
 * let AmberProfile = await tey.getCharacterProfile(
 * 'ckiffwvsx0000990i1z9retm4'
 * );
 * let CharacterProfiles = await tey.getCharacterProfiles();
 *
 * ```
 *
 * ## All methods support optional arguments
 *
 */

export default class Teyvat extends EventEmitter {
  //Base URL
  readonly base!: string;
  //TEYVAT token
  public _token!: TeyvatToken;
  //all methods below this point
  //each cache has an index of null, which is assigned to the default caller for the methods that dont require parameters. AKA getCharacters(), without parameter options.
  //TODO Add lifetime for the cached requests so they can be refreshed, in case there are any updates in the API's database, a setInterval every couple hours would be preferred over checking on every request has reached its lifetime
  public _charactersCache!: Map<
    string | null,
    teyvatdev.Character | teyvatdev.Character[]
  >;
  public _artifactsCache!: Map<
    string | null,
    teyvatdev.Artifact | teyvatdev.Artifact[]
  >;
  public _artifactSetsCache!: Map<
    string | null,
    teyvatdev.ArtifactSet | teyvatdev.ArtifactSet[]
  >;
  public _weaponsCache!: Map<
    string | null,
    teyvatdev.Weapon | teyvatdev.Weapon[]
  >;
  public _regionsCache!: Map<
    string | null,
    teyvatdev.Region | teyvatdev.Region[]
  >;
  public _elementsCache!: Map<
    string | null,
    teyvatdev.Element | teyvatdev.Element[]
  >;
  public _talentsCache!: Map<
    string | null,
    teyvatdev.Talent | teyvatdev.Talent[]
  >;
  public _charactersProfilesCache!: Map<
    string | null,
    teyvatdev.CharacterProfile | teyvatdev.CharacterProfile[]
  >;
  public getCharacter!: (
    name: string,
    options?: baseOptions
  ) => Promise<teyvatdev.Character | undefined>;
  public getCharacters!: (
    options?: baseOptions
  ) => Promise<teyvatdev.Character[] | undefined>;
  public getWeapon!: (
    name: string,
    options?: baseOptions
  ) => Promise<teyvatdev.Weapon | undefined>;
  public getWeapons!: (
    options?: baseOptions
  ) => Promise<teyvatdev.Weapon[] | undefined>;
  public getRegion!: (
    id: CUID,
    options?: baseOptions
  ) => Promise<teyvatdev.Region | undefined>;
  public getRegions!: (
    options?: baseOptions
  ) => Promise<teyvatdev.Region[] | undefined>;
  public getElement!: (
    id: CUID,
    options?: baseOptions
  ) => Promise<teyvatdev.Region | undefined>;
  public getElements!: (
    options?: baseOptions
  ) => Promise<teyvatdev.Region[] | undefined>;
  public getTalent!: (
    id: CUID,
    options?: baseOptions
  ) => Promise<teyvatdev.Talent | undefined>;
  public getTalents!: (
    options?: baseOptions
  ) => Promise<teyvatdev.Talent[] | undefined>;
  public getCharacterProfile!: (
    id: CUID,
    options?: baseOptions
  ) => Promise<teyvatdev.CharacterProfile | undefined>;
  public getCharacterProfiles!: (
    options?: baseOptions
  ) => Promise<teyvatdev.CharacterProfile[] | undefined>;
  public getArtifacts!: (
    options?: baseOptions
  ) => Promise<teyvatdev.Artifact[] | undefined>;
  public getArtifactSets!: (
    options?: baseOptions
  ) => Promise<teyvatdev.ArtifactSet[] | undefined>;
  public flushCache!: (options?: flushOptions) => void;
  public cacheAll!: () => Promise<boolean>;
  //Checks for errors, returns true on an error'ed request, returns false on a normalised 200 request
  public _errorHandler!: (data: AxiosResponse) => boolean;
  //a retry function to delay
  public _retry!: (delay: number) => Promise<unknown>;
  //when was last request made
  public _lastRequest!: number;
  //current quota left
  public _quota!: number;
  //maximum quota
  public _quotaMax!: number;
  //the amount to be waited for the quota to reset
  public _gracePeriod!: number;

  //the reset timestamp IN SECONDS of when quota resets
  public _reset!: number;
  public _silent!: boolean;
  //When client is ready to be used by the user
  public _ready!: Promise<void>;
  //When the client has successfully fetched the initial rates from the API
  public _cache!: boolean;
  public _hasRates!: boolean;
  public _queue!: any;

  constructor(token: TeyvatToken, options?: TeyvatConstructorOptions) {
    super();
    this._token = token;
    this.base = 'https://rest.teyvat.dev/';
    this._cache = options?.cache !== undefined ? options.cache : true;
    this._silent = options?.silent !== undefined ? options.silent : true;
    this._lastRequest = Date.now();
    this._quota = 0;
    this._quotaMax = 100;
    this._gracePeriod = 15 * 60 * 1000;
    this._reset = Math.ceil(Date.now() / 1000) + 900;
    this._hasRates = false;
    this._artifactsCache = new Map();
    this._artifactSetsCache = new Map();
    this._charactersCache = new Map();
    this._weaponsCache = new Map();
    this._regionsCache = new Map();
    this._elementsCache = new Map();
    this._talentsCache = new Map();
    this._charactersProfilesCache = new Map();
    this._queue = async.queue(async (fn: Function) => {
      return await fn();
    }, 1);
    this.flushCache = function flushCache(options?: flushOptions): void {
      if (!options || options === 'all') {
        this._charactersCache = new Map();
        this._weaponsCache = new Map();
        this._regionsCache = new Map();
        this._elementsCache = new Map();
        this._talentsCache = new Map();
        this._charactersProfilesCache = new Map();
      } else {
        for (let e of options) {
          switch (e) {
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
    };
    this.cacheAll = async function cacheAll(): Promise<boolean> {
      return new Promise(async (res) => {
        if (this._quota < 6) res(false);
        else {
          await this.getCharacters({
            take: 300,
            cache: true,
            select: { talent: true },
          });
          await this.getWeapons({ take: 300, cache: true });
          await this.getRegions({ take: 300, cache: true });
          await this.getElements({ take: 300, cache: true });
          await this.getTalents({ take: 300, cache: true });
          await this.getCharacterProfiles({ take: 300, cache: true });
          await this.getArtifacts({ take: 300, cache: true });
          await this.getArtifactSets({
            take: 300,
            cache: true,
            include: { artifacts: true },
          });
          res(true);
        }
      });
    };
    this._ready = (async () => {
      //dummy request
      let fetchRates = await axios
        .get(this.base + 'character', {
          headers: {
            Authorization: 'Bearer ' + this._token,
          },
          params: {
            name: 'Amber',
          },
        })
        .catch((err) => {
          console.log(err);
          return null;
        });

      if (fetchRates) {
        if (fetchRates.headers['x-ratelimit-remaining'] !== undefined)
          this._quota = fetchRates.headers['x-ratelimit-remaining'];
        if (fetchRates.headers['x-ratelimit-limit'] !== undefined)
          this._quotaMax = fetchRates.headers['x-ratelimit-limit'];
        if (fetchRates.headers['x-ratelimit-reset'] !== undefined)
          this._reset = fetchRates.headers['x-ratelimit-reset'];
        this.emit('ready', true);
      }
    })();
    this._retry = (delay: number): Promise<unknown> =>
      new Promise((resolve) => {
        if (Math.sign(delay) === -1) delay = 900;
        setTimeout(resolve, Math.ceil(delay) * 1000);
      });
    this._errorHandler = function errorHandler(data: AxiosResponse) {
      if (this._silent) return false; //this is as good as swallowing errors, though the user set the lib in silent mode, need to add WARN/INFO/ERROR levels
      if (data?.status === 200) return false;
      console.log({ error: data.data.response });
      return true;
    };
    this.getCharacter = async function getCharacter(
      name: string,
      /**
       * Options:
       *
       */
      options?: baseOptions
    ): Promise<teyvatdev.Character | undefined> {
      //checking if cache has that character
      if (this._charactersCache.has(name) && !options)
        return this._charactersCache.get(name)! as teyvatdev.Character;
      //checking for quota, if its lower than 4, wait until next reset
      if (this._quota < 4 && this._hasRates)
        await this._retry(
          Math.ceil(this._reset) - Math.ceil(Date.now() / 1000)
        );
      let data = undefined;
      try {
        data = await this._queue.push(async () => {
          return await axios.get(this.base + 'character', {
            headers: {
              Authorization: 'Bearer ' + this._token,
            },
            data: { ...options },
            params: {
              name: name,
            },
          });
        });
      } catch (er) {
        this._errorHandler(er);
      }
      if (this._errorHandler(data)) return;
      if (data && data.data.status === 200) {
        this._hasRates = true;
        if (data.headers['x-ratelimit-remaining'] !== undefined)
          this._quota = data.headers['x-ratelimit-remaining'];
        if (data.headers['x-ratelimit-limit'] !== undefined)
          this._quotaMax = data.headers['x-ratelimit-limit'];
        if (data.headers['x-ratelimit-reset'] !== undefined)
          this._reset = data.headers['x-ratelimit-reset'];

        //if data has been returned(aka not null) and there are no custom options, set cache
        if (this._cache && ((!options && data.data) || options?.cache))
          this._charactersCache.set(name, data.data);
      }
      return data?.data as undefined | teyvatdev.Character;
    };
    this.getCharacters = async function getCharacters(
      /**
       * Options:
       *
       */
      options?: baseOptions
    ): Promise<teyvatdev.Character[] | undefined> {
      //ensures that if theres already been a search on _charactersCache that it saves up on a request;
      if (this._charactersCache.has(null) && !options)
        return this._charactersCache.get(null)! as teyvatdev.Character[];
      //quota checker, if quota is lower than 4, await for next reset before attempting it.
      if (this._quota < 4)
        await this._retry(
          Math.ceil(this._reset) - Math.ceil(Date.now() / 1000)
        );
      let data = undefined;
      try {
        data = await this._queue.push(async () => {
          return await axios.get(this.base + 'characters', {
            headers: {
              Authorization: 'Bearer ' + this._token,
            },
            params: {
              ...options,
            },
          });
        });
      } catch (er) {
        this._errorHandler(er);
      }
      if (this._errorHandler(data)) return;
      if (data) {
        if (data.headers['x-ratelimit-remaining'] !== undefined)
          this._quota = data.headers['x-ratelimit-remaining'];
        if (data.headers['x-ratelimit-limit'] !== undefined)
          this._quotaMax = data.headers['x-ratelimit-limit'];
        if (data.headers['x-ratelimit-reset'] !== undefined)
          this._reset = data.headers['x-ratelimit-reset'];
        //setting cache on normal request
        if (this._cache && ((!options && data.data) || options?.cache)) {
          this._charactersCache.set(
            null,
            data.data as unknown as teyvatdev.Character[]
          );
          for (let d of data.data) this._charactersCache.set(d.name, d);
        }
      }
      return data?.data as undefined | teyvatdev.Character[];
    };
    this.getArtifacts = async function getArtifacts(
      /**
       * Options:
       *
       */
      options?: baseOptions
    ): Promise<teyvatdev.Artifact[] | undefined> {
      //ensures that if theres already been a search on _charactersCache that it saves up on a request;
      if (this._artifactsCache.has(null) && !options)
        return this._artifactsCache.get(null)! as teyvatdev.Artifact[];
      //quota checker, if quota is lower than 4, await for next reset before attempting it.
      if (this._quota < 4)
        await this._retry(
          Math.ceil(this._reset) - Math.ceil(Date.now() / 1000)
        );
      let data = undefined;
      try {
        data = await this._queue.push(async () => {
          return await axios.get(this.base + 'artifacts', {
            headers: {
              Authorization: 'Bearer ' + this._token,
            },
            params: {
              ...options,
            },
          });
        });
      } catch (er) {
        this._errorHandler(er);
      }
      if (this._errorHandler(data)) return;
      if (data) {
        if (data.headers['x-ratelimit-remaining'] !== undefined)
          this._quota = data.headers['x-ratelimit-remaining'];
        if (data.headers['x-ratelimit-limit'] !== undefined)
          this._quotaMax = data.headers['x-ratelimit-limit'];
        if (data.headers['x-ratelimit-reset'] !== undefined)
          this._reset = data.headers['x-ratelimit-reset'];
        //setting cache on normal request
        if (this._cache && ((!options && data.data) || options?.cache)) {
          this._artifactsCache.set(
            null,
            data.data as unknown as teyvatdev.Artifact[]
          );
          for (let d of data.data) this._artifactsCache.set(d.name, d);
        }
      }
      return data?.data as undefined | teyvatdev.Artifact[];
    };
    this.getArtifactSets = async function getArtifacts(
      /**
       * Options:
       *
       */
      options?: baseOptions
    ): Promise<teyvatdev.ArtifactSet[] | undefined> {
      //ensures that if theres already been a search on _charactersCache that it saves up on a request;
      if (this._artifactSetsCache.has(null) && !options)
        return this._artifactSetsCache.get(null)! as teyvatdev.ArtifactSet[];
      //@ts-ignore
      if (options?.include) options.include = JSON.stringify(options.include);
      //@ts-ignore
      if (options?.select) options.select = JSON.stringify(options.select);
      //quota checker, if quota is lower than 4, await for next reset before attempting it.
      if (this._quota < 4)
        await this._retry(
          Math.ceil(this._reset) - Math.ceil(Date.now() / 1000)
        );
      let data = undefined;
      try {
        data = await this._queue.push(async () => {
          return await axios.get(this.base + 'artifactSets', {
            headers: {
              Authorization: 'Bearer ' + this._token,
            },
            params: {
              ...options,
            },
          });
        });
      } catch (er) {
        this._errorHandler(er);
      }
      if (this._errorHandler(data)) return;
      if (data) {
        if (data.headers['x-ratelimit-remaining'] !== undefined)
          this._quota = data.headers['x-ratelimit-remaining'];
        if (data.headers['x-ratelimit-limit'] !== undefined)
          this._quotaMax = data.headers['x-ratelimit-limit'];
        if (data.headers['x-ratelimit-reset'] !== undefined)
          this._reset = data.headers['x-ratelimit-reset'];
        //setting cache on normal request
        if (this._cache && ((!options && data.data) || options?.cache)) {
          this._artifactSetsCache.set(
            null,
            data.data as unknown as teyvatdev.ArtifactSet[]
          );
          for (let d of data.data) this._artifactSetsCache.set(d.name, d);
        }
      }
      return data?.data as undefined | teyvatdev.ArtifactSet[];
    };
    this.getWeapon = async function getWeapon(
      id: CUID,
      /**
       * Options:
       *
       */
      options?: baseOptions
    ): Promise<teyvatdev.Weapon | undefined> {
      //checking if cache has that character
      if (this._weaponsCache.has(id) && !options)
        return this._weaponsCache.get(id)! as teyvatdev.Weapon;
      //checking for quota, if its lower than 4, wait until next reset
      if (this._quota < 4)
        await this._retry(
          Math.ceil(this._reset) - Math.ceil(Date.now() / 1000)
        );
      let data = undefined;
      try {
        data = await this._queue.push(async () => {
          return await axios.get(this.base + 'weapon/' + id, {
            headers: {
              Authorization: 'Bearer ' + this._token,
            },
            params: {
              ...options,
            },
          });
        });
      } catch (er) {
        this._errorHandler(er);
      }
      if (this._errorHandler(data)) return;
      if (data) {
        if (data.headers['x-ratelimit-remaining'] !== undefined)
          this._quota = data.headers['x-ratelimit-remaining'];
        if (data.headers['x-ratelimit-limit'] !== undefined)
          this._quotaMax = data.headers['x-ratelimit-limit'];
        if (data.headers['x-ratelimit-reset'] !== undefined)
          this._reset = data.headers['x-ratelimit-reset'];
        //if data has been returned(aka not null) and there are no custom options, set cache
        if (this._cache && ((!options && data.data) || options?.cache))
          this._weaponsCache.set(id, data.data);
      }
      return data?.data as undefined | teyvatdev.Weapon;
    };
    this.getWeapons = async function getWeapons(
      /**
       * Options:
       *
       */
      options?: baseOptions
    ): Promise<teyvatdev.Weapon[] | undefined> {
      //ensures that if theres already been a search on _cweaponsCache that it saves up on a request;
      if (this._weaponsCache.has(null) && !options)
        return this._weaponsCache.get(null)! as teyvatdev.Weapon[];
      //quota checker, if quota is lower than 4, await for next reset before attempting it.
      if (this._quota < 4)
        await this._retry(
          Math.ceil(this._reset) - Math.ceil(Date.now() / 1000)
        );
      let data = undefined;
      try {
        data = await this._queue.push(async () => {
          return await axios.get(this.base + 'weapons', {
            headers: {
              Authorization: 'Bearer ' + this._token,
            },
            params: {
              ...options,
            },
          });
        });
      } catch (er) {
        this._errorHandler(er);
      }
      if (this._errorHandler(data)) return;
      if (data) {
        if (data.headers['x-ratelimit-remaining'] !== undefined)
          this._quota = data.headers['x-ratelimit-remaining'];
        if (data.headers['x-ratelimit-limit'] !== undefined)
          this._quotaMax = data.headers['x-ratelimit-limit'];
        if (data.headers['x-ratelimit-reset'] !== undefined)
          this._reset = data.headers['x-ratelimit-reset'];
        //setting cache on normal request
        if (this._cache && ((!options && data.data) || options?.cache)) {
          this._weaponsCache.set(
            null,
            data.data as unknown as teyvatdev.Weapon[]
          );
          for (let d of data.data) this._weaponsCache.set(d.id, d);
        }
      }
      return data?.data as undefined | teyvatdev.Weapon[];
    };
    this.getRegion = async function getRegion(
      id: CUID,
      /**
       * Options:
       *
       */
      options?: baseOptions
    ): Promise<teyvatdev.Region | undefined> {
      //checking if cache has that character
      if (this._regionsCache.has(id) && !options)
        return this._regionsCache.get(id)! as teyvatdev.Region;
      //checking for quota, if its lower than 4, wait until next reset
      if (this._quota < 4)
        await this._retry(
          Math.ceil(this._reset) - Math.ceil(Date.now() / 1000)
        );
      let data = undefined;
      try {
        data = await this._queue.push(async () => {
          return await axios.get(this.base + 'region/' + id, {
            headers: {
              Authorization: 'Bearer ' + this._token,
            },
            params: {
              ...options,
            },
          });
        });
      } catch (er) {
        this._errorHandler(er);
      }
      if (this._errorHandler(data)) return;
      if (data) {
        if (data.headers['x-ratelimit-remaining'] !== undefined)
          this._quota = data.headers['x-ratelimit-remaining'];
        if (data.headers['x-ratelimit-limit'] !== undefined)
          this._quotaMax = data.headers['x-ratelimit-limit'];
        if (data.headers['x-ratelimit-reset'] !== undefined)
          this._reset = data.headers['x-ratelimit-reset'];
        //if data has been returned(aka not null) and there are no custom options, set cache
        if (this._cache && ((!options && data.data) || options?.cache))
          this._regionsCache.set(id, data.data);
      }
      return data?.data as undefined | teyvatdev.Region;
    };
    this.getRegions = async function getRegions(
      /**
       * Options:
       *
       */
      options?: baseOptions
    ): Promise<teyvatdev.Region[] | undefined> {
      //ensures that if theres already been a search on _regionCache that it saves up on a request;
      if (this._regionsCache.has(null) && !options)
        return this._regionsCache.get(null)! as teyvatdev.Region[];
      //quota checker, if quota is lower than 4, await for next reset before attempting it.
      if (this._quota < 4)
        await this._retry(
          Math.ceil(this._reset) - Math.ceil(Date.now() / 1000)
        );
      let data = undefined;
      try {
        data = await this._queue.push(async () => {
          return await axios.get(this.base + 'regions', {
            headers: {
              Authorization: 'Bearer ' + this._token,
            },
            params: {
              ...options,
            },
          });
        });
      } catch (er) {
        this._errorHandler(er);
      }
      if (this._errorHandler(data)) return;
      if (data) {
        if (data.headers['x-ratelimit-remaining'] !== undefined)
          this._quota = data.headers['x-ratelimit-remaining'];
        if (data.headers['x-ratelimit-limit'] !== undefined)
          this._quotaMax = data.headers['x-ratelimit-limit'];
        if (data.headers['x-ratelimit-reset'] !== undefined)
          this._reset = data.headers['x-ratelimit-reset'];
        //setting cache on normal request
        if (this._cache && ((!options && data.data) || options?.cache)) {
          this._regionsCache.set(
            null,
            data.data as unknown as teyvatdev.Region[]
          );
          for (let d of data.data) this._regionsCache.set(d.id, d);
        }
      }
      return data?.data as undefined | teyvatdev.Region[];
    };
    this.getElement = async function getElement(
      id: string,
      /**
       * Options:
       *
       */
      options?: baseOptions
    ): Promise<teyvatdev.Element | undefined> {
      //checking if cache has that character
      if (this._elementsCache.has(id) && !options)
        return this._elementsCache.get(id)! as teyvatdev.Element;
      //checking for quota, if its lower than 4, wait until next reset
      if (this._quota < 4)
        await this._retry(
          Math.ceil(this._reset) - Math.ceil(Date.now() / 1000)
        );
      let data = undefined;
      try {
        data = await this._queue.push(async () => {
          return await axios.get(this.base + 'element/' + id, {
            headers: {
              Authorization: 'Bearer ' + this._token,
            },
            params: {
              ...options,
            },
          });
        });
      } catch (er) {
        this._errorHandler(er);
      }
      if (this._errorHandler(data)) return;
      if (data) {
        if (data.headers['x-ratelimit-remaining'] !== undefined)
          this._quota = data.headers['x-ratelimit-remaining'];
        if (data.headers['x-ratelimit-limit'] !== undefined)
          this._quotaMax = data.headers['x-ratelimit-limit'];
        if (data.headers['x-ratelimit-reset'] !== undefined)
          this._reset = data.headers['x-ratelimit-reset'];
        //if data has been returned(aka not null) and there are no custom options, set cache
        if (this._cache && ((!options && data.data) || options?.cache))
          this._elementsCache.set(id, data.data);
      }
      return data?.data as undefined | teyvatdev.Element;
    };
    this.getElements = async function getElements(
      /**
       * Options:
       *
       */
      options?: baseOptions
    ): Promise<teyvatdev.Element[] | undefined> {
      //ensures that if theres already been a search on _elementsCache that it saves up on a request;
      if (this._elementsCache.has(null) && !options)
        return this._elementsCache.get(null)! as teyvatdev.Element[];
      //quota checker, if quota is lower than 4, await for next reset before attempting it.
      if (this._quota < 4)
        await this._retry(
          Math.ceil(this._reset) - Math.ceil(Date.now() / 1000)
        );
      let data = undefined;
      try {
        data = await this._queue.push(async () => {
          return await axios.get(this.base + 'elements', {
            headers: {
              Authorization: 'Bearer ' + this._token,
            },
            params: {
              ...options,
            },
          });
        });
      } catch (er) {
        this._errorHandler(er);
      }
      if (this._errorHandler(data)) return;
      if (data) {
        if (data.headers['x-ratelimit-remaining'] !== undefined)
          this._quota = data.headers['x-ratelimit-remaining'];
        if (data.headers['x-ratelimit-limit'] !== undefined)
          this._quotaMax = data.headers['x-ratelimit-limit'];
        if (data.headers['x-ratelimit-reset'] !== undefined)
          this._reset = data.headers['x-ratelimit-reset'];
        //setting cache on normal request
        if (this._cache && ((!options && data.data) || options?.cache)) {
          this._elementsCache.set(
            null,
            data.data as unknown as teyvatdev.Element[]
          );
          for (let d of data.data) this._elementsCache.set(d.id, d);
        }
      }
      return data?.data as undefined | teyvatdev.Element[];
    };
    this.getTalent = async function getTalent(
      id: CUID,
      /**
       * Options:
       *
       */
      options?: baseOptions
    ): Promise<teyvatdev.Talent | undefined> {
      //checking if cache has that character
      if (this._talentsCache.has(id) && !options)
        return this._talentsCache.get(id)! as teyvatdev.Talent;
      //checking for quota, if its lower than 4, wait until next reset
      if (this._quota < 4)
        await this._retry(
          Math.ceil(this._reset) - Math.ceil(Date.now() / 1000)
        );
      let data = undefined;
      try {
        data = await this._queue.push(async () => {
          return await axios.get(this.base + 'talent/' + id, {
            headers: {
              Authorization: 'Bearer ' + this._token,
            },
            params: {
              ...options,
            },
          });
        });
      } catch (er) {
        this._errorHandler(er);
      }
      if (this._errorHandler(data)) return;
      if (data) {
        if (data.headers['x-ratelimit-remaining'] !== undefined)
          this._quota = data.headers['x-ratelimit-remaining'];
        if (data.headers['x-ratelimit-limit'] !== undefined)
          this._quotaMax = data.headers['x-ratelimit-limit'];
        if (data.headers['x-ratelimit-reset'] !== undefined)
          this._reset = data.headers['x-ratelimit-reset'];
        //if data has been returned(aka not null) and there are no custom options, set cache
        if (this._cache && ((!options && data.data) || options?.cache))
          this._talentsCache.set(id, data.data);
      }
      return data?.data as undefined | teyvatdev.Talent;
    };
    this.getTalents = async function getTalents(
      /**
       * Options:
       *
       */
      options?: baseOptions
    ): Promise<teyvatdev.Talent[] | undefined> {
      //ensures that if theres already been a search on _talentsCache that it saves up on a request;
      if (this._talentsCache.has(null) && !options)
        return this._talentsCache.get(null)! as teyvatdev.Talent[];
      //quota checker, if quota is lower than 4, await for next reset before attempting it.
      if (this._quota < 4)
        await this._retry(
          Math.ceil(this._reset) - Math.ceil(Date.now() / 1000)
        );
      let data = undefined;
      try {
        data = await this._queue.push(async () => {
          return await axios.get(this.base + 'talents', {
            headers: {
              Authorization: 'Bearer ' + this._token,
            },
            params: {
              ...options,
            },
          });
        });
      } catch (er) {
        this._errorHandler(er);
      }
      if (this._errorHandler(data)) return;
      if (data) {
        if (data.headers['x-ratelimit-remaining'] !== undefined)
          this._quota = data.headers['x-ratelimit-remaining'];
        if (data.headers['x-ratelimit-limit'] !== undefined)
          this._quotaMax = data.headers['x-ratelimit-limit'];
        if (data.headers['x-ratelimit-reset'] !== undefined)
          this._reset = data.headers['x-ratelimit-reset'];
        //setting cache on normal request
        if (this._cache && ((!options && data.data) || options?.cache)) {
          this._talentsCache.set(
            null,
            data.data as unknown as teyvatdev.Talent[]
          );
          for (let d of data.data) this._talentsCache.set(d.id, d);
        }
      }
      return data?.data as undefined | teyvatdev.Talent[];
    };
    this.getCharacterProfile = async function getCharacterProfile(
      id: CUID,
      /**
       * Options:
       *
       */
      options?: baseOptions
    ): Promise<teyvatdev.CharacterProfile | undefined> {
      //checking if cache has that character
      if (this._charactersProfilesCache.has(id) && !options)
        return this._charactersProfilesCache.get(
          id
        )! as teyvatdev.CharacterProfile;
      //checking for quota, if its lower than 4, wait until next reset
      if (this._quota < 4)
        await this._retry(
          Math.ceil(this._reset) - Math.ceil(Date.now() / 1000)
        );
      let data = undefined;
      try {
        data = await this._queue.push(async () => {
          return await axios.get(this.base + 'characterProfile/' + id, {
            headers: {
              Authorization: 'Bearer ' + this._token,
            },
            params: {
              ...options,
            },
          });
        });
      } catch (er) {
        this._errorHandler(er);
      }
      if (this._errorHandler(data)) return;
      if (data) {
        if (data.headers['x-ratelimit-remaining'] !== undefined)
          this._quota = data.headers['x-ratelimit-remaining'];
        if (data.headers['x-ratelimit-limit'] !== undefined)
          this._quotaMax = data.headers['x-ratelimit-limit'];
        if (data.headers['x-ratelimit-reset'] !== undefined)
          this._reset = data.headers['x-ratelimit-reset'];
        //if data has been returned(aka not null) and there are no custom options, set cache
        if (this._cache && ((!options && data.data) || options?.cache))
          this._charactersProfilesCache.set(id, data.data);
      }
      return data?.data as undefined | teyvatdev.CharacterProfile;
    };
    this.getCharacterProfiles = async function getCharacterProfiles(
      /**
       * Options:
       *
       */
      options?: baseOptions
    ): Promise<teyvatdev.CharacterProfile[] | undefined> {
      //ensures that if theres already been a search on _charactersProfilesCache that it saves up on a request;
      if (this._charactersProfilesCache.has(null) && !options)
        return this._charactersProfilesCache.get(
          null
        )! as teyvatdev.CharacterProfile[];
      //quota checker, if quota is lower than 4, await for next reset before attempting it.
      if (this._quota < 4)
        await this._retry(
          Math.ceil(this._reset) - Math.ceil(Date.now() / 1000)
        );
      let data = undefined;
      try {
        data = await this._queue.push(async () => {
          return await axios.get(this.base + 'characterProfiles', {
            headers: {
              Authorization: 'Bearer ' + this._token,
            },
            params: {
              ...options,
            },
          });
        });
      } catch (er) {
        this._errorHandler(er);
      }
      if (this._errorHandler(data)) return;
      if (data) {
        if (data.headers['x-ratelimit-remaining'] !== undefined)
          this._quota = data.headers['x-ratelimit-remaining'];
        if (data.headers['x-ratelimit-limit'] !== undefined)
          this._quotaMax = data.headers['x-ratelimit-limit'];
        if (data.headers['x-ratelimit-reset'] !== undefined)
          this._reset = data.headers['x-ratelimit-reset'];
        //setting cache on normal request
        if (this._cache && ((!options && data.data) || options?.cache)) {
          this._charactersProfilesCache.set(
            null,
            data.data as unknown as teyvatdev.CharacterProfile[]
          );
          for (let d of data.data) this._charactersProfilesCache.set(d.id, d);
        }
      }
      return data?.data as undefined | teyvatdev.CharacterProfile[];
    };
    if (options?.aggressive) {
      setTimeout(() => {
        this.cacheAll().then((d) => {
          if (!options?.silent)
            console.log(
              d
                ? '[TeyvatLib]: Cached all entries'
                : '[TeyvatLib]: Failed to cache all entries'
            );
        });
      }, 30000);
    }
  }
}
