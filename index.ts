import * as teyvatdev from '@teyvatdev/types';
import * as async from 'async';
import Axios, { AxiosResponse } from 'axios';
import { EventEmitter } from 'events';
const axios = Axios.create({
  timeout: 60000,
  //httpsAgent: agent,
});

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
 * const tey = new Tey.default('Token Here');
 *
 * tey.getCharacter('Amber').then((data) => {
 * console.log(data);
 *  //Expected, Amber stats or undefined
 * })
 *
 * ```
 * ## How to get your token:
 *
 * ```
 * const Tey = require('../TeyvatLib/index');
 * const tey = new Tey.default('Token Here');
 * tey.createAccount('some_email@gmail.com', 'myusername', 'myfancypassword').then((res) => {
 *  if(res) console.log('Success, now activate it on ur mail');
 *  else console.log('Something wrong happened!');
 * })
 * // AFTER YOU ACTIVATED IT, DONT RUN THE REST OR IT WILL ERROR
 *
 * tey.login('some_email@gmail.com', 'myfancypassword').then(res => {
 *  if(!res) console.log('Failed to login! Did u make sure to active ur account in your email?');
 *  else console.log(res.token);
 * })
 * ```
 *
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
    name: string
  ) => Promise<teyvatdev.Character | undefined>;
  public getCharacters!: () => Promise<teyvatdev.Character[] | undefined>;
  public getWeapon!: (name: string) => Promise<teyvatdev.Weapon | undefined>;
  public getWeapons!: () => Promise<teyvatdev.Weapon[] | undefined>;
  public getRegion!: (id: CUID) => Promise<teyvatdev.Region | undefined>;
  public getRegions!: () => Promise<teyvatdev.Region[] | undefined>;
  public getElement!: (id: CUID) => Promise<teyvatdev.Region | undefined>;
  public getElements!: () => Promise<teyvatdev.Region[] | undefined>;
  public getTalent!: (id: CUID) => Promise<teyvatdev.Talent | undefined>;
  public getTalents!: () => Promise<teyvatdev.Talent[] | undefined>;
  public getCharacterProfile!: (
    id: CUID
  ) => Promise<teyvatdev.CharacterProfile | undefined>;
  public getCharacterProfiles!: () => Promise<
    teyvatdev.CharacterProfile[] | undefined
  >;
  public getArtifacts!: () => Promise<teyvatdev.Artifact[] | undefined>;
  public getArtifactSets!: () => Promise<teyvatdev.ArtifactSet[] | undefined>;
  public flushCache!: (options?: flushOptions) => void;
  public baseRequest!: (param: {
    endpoint: string;
    name?: string;
    skipCacheCheck?: boolean;
    dontCache?: boolean;
    cache: Map<any, any>;
    body?: { [key: string]: any };
    params?: { [key: string]: any };
  }) => Promise<any>;
  public setSkips!: (fn: Function, payload: any) => Promise<any>;
  public cacheAll!: () => Promise<boolean>;
  //Checks for errors, returns true on an error'ed request, returns false on a normalised 200 request
  public _errorHandler!: (data: AxiosResponse) => boolean;
  //a retry function to delay
  public _retry!: (delay: number) => Promise<unknown>;
  public createAccount!: (
    email: string,
    username: string,
    password: string
  ) => Promise<boolean>;
  public login!: (
    email: string,
    password: string
  ) => Promise<
    | false
    | {
        token: string;
        user: {
          id: string;
          slimeColor: null | number;
          role: string;
          email: string;
          createdAt: string;
          updatedAt: string;
          username: string;
        };
      }
  >;
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

  constructor(token: TeyvatToken, options: TeyvatConstructorOptions = {}) {
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
    this.baseRequest = async (param: {
      endpoint: string;
      name?: string;
      skipCacheCheck?: boolean;
      dontCache?: boolean;
      cache: Map<any, any>;
      body?: { [key: string]: any };
      params?: { [key: string]: any };
    }): Promise<any> => {
      let data = undefined;
      //checking if skipCacheCheck is true
      if (!param.skipCacheCheck && param.name)
        if (param.cache.has(param.name)) return param.cache.get(param.name);
      //checking for quota, if its lower than 4, wait until next reset
      if (this._quota < 4 && this._hasRates)
        await this._retry(
          Math.ceil(this._reset) - Math.ceil(Date.now() / 1000)
        );
      // formatting body/params / accounting for stupidity
      if (
        param.params?.take &&
        (param.params.take > 100 || param.params.take <= 0)
      )
        param.params.take = 100;
      if (param.body?.take && (param.body.take > 100 || param.body.take <= 0))
        param.body.take = 100;

      try {
        this.emit('restRequest', { data: param });
        data = await this._queue.push(async () => {
          return await axios
            .post(
              `${this.base}${param.endpoint}`,
              {
                ...param.body,
              },
              {
                headers: {
                  Authorization: 'Bearer ' + this._token,
                },
                params: {
                  ...param.params,
                  name: param.name,
                },
              }
            )
            .catch((e) => {
              this.emit('restError', { error: e });
              return e;
            });
        });
        this.emit('restResponse', { data });
      } catch (er) {
        this.emit('restResponse', { data });
        //@ts-expect-error
        this._errorHandler(er);
      }
      if (this._errorHandler(data)) return;
      if (data && data.status === 200) {
        this._hasRates = true;
        if (data.headers['x-ratelimit-remaining'] !== undefined)
          this._quota = data.headers['x-ratelimit-remaining'];
        if (data.headers['x-ratelimit-limit'] !== undefined)
          this._quotaMax = data.headers['x-ratelimit-limit'];
        if (data.headers['x-ratelimit-reset'] !== undefined)
          this._reset = data.headers['x-ratelimit-reset'];

        //if data has been returned(aka not null) and there are no custom options, set cache
        if (!param.dontCache && data.data) {
          param.cache.set(param.name ? param.name : null, data.data);
          if (data.data.length)
            for (let d of data.data) if (d.name) param.cache.set(d.name, d);
        }
      }
      return data?.data as undefined | any;
    };
    this.setSkips = async (fn: Function, payload: any) => {
      let _payload = payload ?? { body: {}, params: {} };
      if (!_payload.body?.take) _payload.body.take = 100;
      let res: any[] = await new Promise(async (r, rej) => {
        r(await fn(_payload));
      });
      // console.log({ res, _payload });
      if (res?.length === (_payload?.body.take ?? 100)) {
        _payload.body.skip = (_payload.body.skip ?? 0) + res.length;
        res = res.concat(await this.setSkips(fn.bind(this), _payload));
      }
      return res;
    };
    this.cacheAll = async (): Promise<boolean> => {
      return new Promise(async (res) => {
        if (this._quota < 6) res(false);
        else {
          await this.setSkips(this.baseRequest.bind(this), {
            endpoint: 'characters',
            skipCacheCheck: true,
            cache: this._charactersCache,
            body: { take: 100, include: { talents: true, ascensions: true } },
          });
          await this.setSkips(this.baseRequest.bind(this), {
            endpoint: 'weapons',
            skipCacheCheck: true,
            cache: this._weaponsCache,
            body: { take: 100, include: { weaponAscensions: true } },
          });
          await this.setSkips(this.baseRequest.bind(this), {
            endpoint: 'regions',
            skipCacheCheck: true,
            cache: this._regionsCache,
            body: { take: 100 },
          });
          await this.setSkips(this.baseRequest.bind(this), {
            endpoint: 'elements',
            skipCacheCheck: true,
            cache: this._elementsCache,
            body: { take: 100 },
          });
          await this.setSkips(this.baseRequest.bind(this), {
            endpoint: 'talents',
            skipCacheCheck: true,
            cache: this._talentsCache,
            body: { take: 100 },
          });
          await this.setSkips(this.baseRequest.bind(this), {
            endpoint: 'characterProfiles',
            skipCacheCheck: true,
            cache: this._charactersProfilesCache,
            body: { take: 100 },
          });
          await this.setSkips(this.baseRequest.bind(this), {
            endpoint: 'artifacts',
            skipCacheCheck: true,
            cache: this._artifactsCache,
            body: { take: 100 },
          });
          await this.setSkips(this.baseRequest.bind(this), {
            endpoint: 'artifactSets',
            skipCacheCheck: true,
            cache: this._artifactSetsCache,
            body: { take: 100, include: { artifacts: true } },
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
        if (options?.aggressive) await this.cacheAll();
        this.emit('ready', true);
      }
    })();
    this._retry = async function _retry(delay: number): Promise<unknown> {
      return new Promise((resolve) => {
        if (Math.sign(delay) === -1) delay = 900;
        setTimeout(resolve, Math.ceil(delay) * 1000);
      });
    };
    this.login = async (email: string, password: string) => {
      if (!email) throw new Error('No email provided, or empty string!');
      if (!password) throw new Error('No password provided, or empty string!');
      if (typeof email !== 'string')
        throw new Error('Type of email is not string!');
      if (typeof password !== 'string')
        throw new Error('Type of password is not string!');
      let res = await axios.post(
        this.base + 'auth/login',
        {
          email,
          password,
        },
        {}
      );
      if (res?.status === 200) {
        return res.data as {
          token: string;
          user: {
            id: string;
            slimeColor: null | number;
            role: string;
            email: string;
            createdAt: string;
            updatedAt: string;
            username: string;
          };
        };
      } else {
        console.log(res);
        return false;
      }
    };
    this.createAccount = async (
      email: string,
      username: string,
      password: string
    ) => {
      if (!email) throw new Error('No email provided, or empty string!');
      if (!username) throw new Error('No username provided, or empty string!');
      if (!password) throw new Error('No password provided, or empty string!');
      if (typeof email !== 'string')
        throw new Error('Type of email is not string!');
      if (typeof username !== 'string')
        throw new Error('Type of username is not string!');
      if (typeof password !== 'string')
        throw new Error('Type of password is not string!');
      let res = await axios.post(
        this.base + 'auth/signup',
        {
          email,
          username,
          password,
        },
        {}
      );
      if (res?.status === 200) {
        console.log(
          'Successfully registered on the API. Go and activate your account on the email provided. Then use .login() to get your token, make sure NOT to show your token to anyone'
        );
        return true;
      } else {
        console.log(res);
        return false;
      }
    };
    this._errorHandler = (data: AxiosResponse) => {
      if (!data) return false;
      if (this._silent) return false; //this is as good as swallowing errors, though the user set the lib in silent mode, need to add WARN/INFO/ERROR levels
      if (data?.status === 200) return false;
      this.emit('errorHandler', { data });
      return true;
    };
    this.getCharacter = async function getCharacter(
      name: string
    ): Promise<teyvatdev.Character | undefined> {
      let data = await this.baseRequest({
        endpoint: 'character',
        name,
        skipCacheCheck: false,
        cache: this._charactersCache,
      });
      if (data) return data as teyvatdev.Character;
      return undefined;
    };
    this.getCharacters = async function getCharacters(): Promise<
      teyvatdev.Character[] | undefined
    > {
      let data = await this.setSkips(this.baseRequest.bind(this), {
        endpoint: 'characters',
        skipCacheCheck: false,
        cache: this._charactersCache,
        body: { take: 100, include: { talents: true, ascensions: true } },
      });
      if (data && data.length) return data as teyvatdev.Character[];
      return undefined;
    };
    this.getArtifacts = async function getArtifacts(): Promise<
      teyvatdev.Artifact[] | undefined
    > {
      let data = await this.setSkips(this.baseRequest.bind(this), {
        endpoint: 'artifacts',
        skipCacheCheck: false,
        cache: this._artifactsCache,
        body: { take: 100 },
      });
      if (data && data.length) return data as teyvatdev.Artifact[];
      return undefined;
    };
    this.getArtifactSets = async function getArtifacts(): Promise<
      teyvatdev.ArtifactSet[] | undefined
    > {
      let data = await this.setSkips(this.baseRequest.bind(this), {
        endpoint: 'artifacts',
        skipCacheCheck: false,
        cache: this._artifactSetsCache,
        body: { take: 100 },
      });
      if (data && data.length) return data as teyvatdev.ArtifactSet[];
      return undefined;
    };
    this.getWeapon = async function getWeapon(
      id: CUID
    ): Promise<teyvatdev.Weapon | undefined> {
      let data = await this.baseRequest({
        endpoint: 'weapon',
        skipCacheCheck: false,
        params: { id },
        cache: this._weaponsCache,
      });
      if (data) return data as teyvatdev.Weapon;
      return undefined;
    };
    this.getWeapons = async function getWeapons(): Promise<
      teyvatdev.Weapon[] | undefined
    > {
      let data = await this.setSkips(this.baseRequest.bind(this), {
        endpoint: 'weapons',
        skipCacheCheck: false,
        cache: this._weaponsCache,
        body: { take: 100, include: { weaponAscensions: true } },
      });
      if (data && data.length) return data as teyvatdev.Weapon[];
      return undefined;
    };
    this.getRegion = async function getRegion(
      id: CUID
    ): Promise<teyvatdev.Region | undefined> {
      let data = await this.baseRequest({
        endpoint: 'region',
        params: { id },
        skipCacheCheck: false,
        cache: this._regionsCache,
      });
      if (data) return data as teyvatdev.Region;
      return undefined;
    };
    this.getRegions = async function getRegions(): Promise<
      teyvatdev.Region[] | undefined
    > {
      let data = await this.setSkips(this.baseRequest.bind(this), {
        endpoint: 'regions',
        skipCacheCheck: false,
        cache: this._regionsCache,
        body: { take: 100 },
      });
      if (data && data.length) return data as teyvatdev.Region[];
      return undefined;
    };
    this.getElement = async function getElement(
      id: string
    ): Promise<teyvatdev.Element | undefined> {
      let data = await this.baseRequest({
        endpoint: 'element',
        params: { id },
        skipCacheCheck: false,
        cache: this._elementsCache,
      });
      if (data) return data as teyvatdev.Element;
      return undefined;
    };
    this.getElements = async function getElements(): Promise<
      teyvatdev.Element[] | undefined
    > {
      let data = await this.setSkips(this.baseRequest.bind(this), {
        endpoint: 'elements',
        skipCacheCheck: false,
        cache: this._elementsCache,
        body: { take: 100 },
      });
      if (data && data.length) return data as teyvatdev.Element[];
      return undefined;
    };
    this.getTalent = async function getTalent(
      id: CUID
    ): Promise<teyvatdev.Talent | undefined> {
      let data = await this.baseRequest({
        endpoint: 'talent',
        params: { id },
        skipCacheCheck: false,
        cache: this._talentsCache,
      });
      if (data) return data as teyvatdev.Talent;
      return undefined;
    };
    this.getTalents = async function getTalents(): Promise<
      teyvatdev.Talent[] | undefined
    > {
      let data = await this.setSkips(this.baseRequest.bind(this), {
        endpoint: 'talents',
        skipCacheCheck: false,
        cache: this._talentsCache,
        body: { take: 100 },
      });
      if (data && data.length) return data as teyvatdev.Talent[];
      return undefined;
    };
    this.getCharacterProfile = async function getCharacterProfile(
      id: CUID
    ): Promise<teyvatdev.CharacterProfile | undefined> {
      let data = await this.baseRequest({
        endpoint: 'characterProfile',
        params: { id },
        skipCacheCheck: false,
        cache: this._charactersProfilesCache,
      });
      if (data) return data as teyvatdev.CharacterProfile;
      return undefined;
    };
    this.getCharacterProfiles = async function getCharacterProfiles(): Promise<
      teyvatdev.CharacterProfile[] | undefined
    > {
      let data = await this.setSkips(this.baseRequest.bind(this), {
        endpoint: 'characterProfiles',
        skipCacheCheck: false,
        cache: this._charactersCache,
        body: { take: 100 },
      });
      if (data && data.length) return data as teyvatdev.CharacterProfile[];
      return undefined;
    };
  }
}
