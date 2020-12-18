import axios, { AxiosAdapter, AxiosResponse } from 'axios';
import * as teyvatdev from '@teyvatdev/types';
import * as async from 'async';
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
  include?: any;
  /**
   * Used internally for aggressive caching
   */
  cache?: boolean;
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
 * ## How to get your token
 *
 * Make sure to verify your email before continuing, otherwise you will get an error. Do registerUser() first, verify email, then do getToken();
 * It is recommended to keep your token safe and secure. Tips: Do not hardcode your token, add it to an .ENV file or a config.json;
 *
 *
 * ## Node-js(TypeScript)
 * ```
 * import { Register } from 'teyvatdev-node-sdk'
 *
 * const register = new Register('YourEmailHere','YourPasswordHere');
 * register.registerUser();
 *
 * //Go to your email and activate it before continuining!!!!
 * register.getToken().then((token) => console.log(token));
 * ```
 *
 * ## Node-js(JavaScript)
 * ```
 * const Register = require('teyvatdev-node-sdk').Register;
 *
 * const register = new Register('YourEmailHere','YourPasswordHere');
 * register.registerUser();
 *
 * //Go to your email and activate it before continuining!!!!
 * register.getToken().then((token) => console.log(token));
 * ```
 *
 * After you've acquired your token, you may use it on the Teyvat constructor, which is the one used for the API wrapper
 *
 * Thats it, you finished!
 *
 *
 * If you wish an automated script to run it and get your token, i've made this so you can paste it on your script to run it, it will wait 5 minutes until your email gets verified, then run the rest of the code
 *
 * ## DO NOT SHARE YOUR TOKEN, THESE SCRIPTS WILL LOG YOUR TOKEN IN YOUR TERMINAL!
 *
 * ## TypeScript Automatic Script (TOKEN IN CONSOLE)
 * ```
 * import { Register } from 'teyvatdev-node-sdk';
 *
 * const register = new Register('YourEmailHere','YourPasswordHere');
 * register.registerUser().then(user:string|null => {
 *  if(!user) return console.log('There was an error registering, please retry');
 *  console.log('Please go verify at the email provided! The script will continue in 5 minutes, verify it before then!')
 *  setTimeout(() => {
 *  //This is delay for you to go verify your email, you got 5 minutes
 *  register.getToken().then(token:string|null => {
 *   if(token) console.log(token);
 *   else console.log('An error occurred, token returned null');
 *   });
 * },300000)
 * })
 *
 * ```
 * ## JavaScript Automatic Script (TOKEN IN CONSOLE)
 * ```
 * const Register = require('teyvatdev-node-sdk').Register;
 * const register = new Register('YourEmailHere','YourPasswordHere');
 * register.registerUser().then(user => {
 *  if(!user) return console.log('There was an error registering, please retry');
 *  console.log('Please go verify at the email provided! The script will continue in 5 minutes, verify it before then!')
 *  setTimeout(() => {
 *  //This is delay for you to go verify your email, you got 5 minutes
 *  register.getToken().then(token => {
 *   if(token) console.log(token);
 *   else console.log('An error occurred, token returned null');
 *   });
 * },300000)
 * })
 *
 * ```
 */
export class Register {
  registerUser!: (email?: string, password?: string) => Promise<string | null>;
  getToken!: (email?: string, password?: string) => Promise<TeyvatToken | null>;
  base!: string;
  _email!: string;
  _password!: string;
  constructor(email: string, password: string) {
    this.base = 'https://rest.teyvat.dev/';
    this._email = email;
    this._password = password;
    this.registerUser = async function registerUser(
      email?: string,
      password?: string
    ): Promise<string | null> {
      let req = await axios
        .post(this.base + 'signup', {
          email: email ? email : this._email,
          password: password ? password : this._password,
        })
        .catch((err) => console.log(err.response));
      if (!req || req.data.status !== 200) return null;
      else
        return 'Success, please verify the email and do getToken() with same params!';
    };
    this.getToken = async function getToken(
      email?: string,
      password?: string
    ): Promise<string | null> {
      let req = await axios
        .post(this.base + 'login', {
          email: email ? email : this._email,
          password: password ? password : this._password,
        })
        .catch((err) => console.log(err.response));
      if (!req || req.status !== 200) return null;
      else return req.data.token;
    };
  }
}

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

export default class Teyvat {
  //Base URL
  readonly base!: string;
  //TEYVAT token
  private _token!: TeyvatToken;
  //all methods below this point
  //each cache has an index of null, which is assigned to the default caller for the methods that dont require parameters. AKA getCharacters(), without parameter options.
  //TODO Add lifetime for the cached requests so they can be refreshed, in case there are any updates in the API's database, a setInterval every couple hours would be preferred over checking on every request has reached its lifetime
  private _charactersCache!: Map<
    string | null,
    teyvatdev.Character | teyvatdev.Character[]
  >;
  private _weaponsCache!: Map<
    string | null,
    teyvatdev.Weapon | teyvatdev.Weapon[]
  >;
  private _regionsCache!: Map<
    string | null,
    teyvatdev.Region | teyvatdev.Region[]
  >;
  private _elementsCache!: Map<
    string | null,
    teyvatdev.Element | teyvatdev.Element[]
  >;
  private _talentsCache!: Map<
    string | null,
    teyvatdev.Talent | teyvatdev.Talent[]
  >;
  private _charactersProfilesCache!: Map<
    string | null,
    teyvatdev.CharacterProfile | teyvatdev.CharacterProfile[]
  >;
  public getToken!: (email: string, password: string) => Promise<TeyvatToken>;
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
  public flushCache!: (options?: flushOptions) => void;
  public cacheAll!: () => Promise<boolean>;
  //Checks for errors, returns true on an error'ed request, returns false on a normalised 200 request
  private _errorHandler!: (data: AxiosResponse) => boolean;
  //when was last request made
  private _lastRequest!: number;
  //current quota left
  private _quota!: number;
  //maximum quota
  private _quotaMax!: number;
  //the amount to be waited for the quota to reset
  private _gracePeriod!: number;
  //a retry function to delay
  private _retry!: (delay: number) => Promise<unknown>;
  //the reset timestamp IN SECONDS of when quota resets
  private _reset!: number;
  private _silent!: boolean;
  //When client is ready to be used by the user
  private _ready!: Promise<void>;
  //When the client has successfully fetched the initial rates from the API
  private _cache!: boolean;
  private _hasRates!: boolean;
  private _queue!: any;
  constructor(token: TeyvatToken, options?: TeyvatConstructorOptions) {
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
          await this.getCharacters({ take: 300, cache: true });
          await this.getWeapons({ take: 300, cache: true });
          await this.getRegions({ take: 300, cache: true });
          await this.getElements({ take: 300, cache: true });
          await this.getTalents({ take: 300, cache: true });
          await this.getCharacterProfiles({ take: 300, cache: true });
          res(true);
        }
      });
    };
    this._ready = (async () => {
      //dummy request
      let fetchRates = await axios.get(this.base + 'character', {
        headers: {
          Authorization: 'Bearer ' + this._token,
        },
        params: {
          name: 'Amber',
        },
      });
      if (fetchRates) {
        if (fetchRates.headers['x-ratelimit-remaining'] !== undefined)
          this._quota = fetchRates.headers['x-ratelimit-remaining'];
        if (fetchRates.headers['x-ratelimit-limit'] !== undefined)
          this._quotaMax = fetchRates.headers['x-ratelimit-limit'];
        if (fetchRates.headers['x-ratelimit-reset'] !== undefined)
          this._reset = fetchRates.headers['x-ratelimit-reset'];
      }
    })();
    this._retry = (delay: number): Promise<unknown> =>
      new Promise((resolve) => {
        if (Math.sign(delay) === -1) delay = 900;
        setTimeout(resolve, Math.ceil(delay) * 1000);
      });
    this._errorHandler = function errorHandler(data: AxiosResponse) {
      if (this._silent) return false; //this is as good as swallowing errors, though the user set the lib in silent mode, need to add WARN/INFO/ERROR levels
      if (data.status === 200) return false;
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
            params: {
              name: name,
              ...options,
            },
          });
        });
      } catch (er) {
        this._errorHandler(er);
      }
      if (!this._errorHandler(data)) return;
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
      if (!this._errorHandler(data)) return;
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
            (data.data as unknown) as teyvatdev.Character[]
          );
          for (let d of data.data) this._charactersCache.set(d.name, d);
        }
      }
      return data?.data as undefined | teyvatdev.Character[];
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
      if (!this._errorHandler(data)) return;
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
      if (!this._errorHandler(data)) return;
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
            (data.data as unknown) as teyvatdev.Weapon[]
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
      if (!this._errorHandler(data)) return;
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
      if (!this._errorHandler(data)) return;
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
            (data.data as unknown) as teyvatdev.Region[]
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
      if (!this._errorHandler(data)) return;
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
      if (!this._errorHandler(data)) return;
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
            (data.data as unknown) as teyvatdev.Element[]
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
      if (!this._errorHandler(data)) return;
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
      if (!this._errorHandler(data)) return;
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
            (data.data as unknown) as teyvatdev.Talent[]
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
      if (!this._errorHandler(data)) return;
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
      if (!this._errorHandler(data)) return;
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
            (data.data as unknown) as teyvatdev.CharacterProfile[]
          );
          for (let d of data.data) this._charactersProfilesCache.set(d.id, d);
        }
      }
      return data?.data as undefined | teyvatdev.CharacterProfile[];
    };
    if (options?.aggressive) {
      setTimeout(() => {
        this.cacheAll().then((d) =>
          console.log(
            d
              ? '[TeyvatLib]: Cached all entries'
              : '[TeyvatLib]: Failed to cache all entries'
          )
        );
      }, 30000);
    }
  }
}
