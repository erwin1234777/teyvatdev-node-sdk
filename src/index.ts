import type {
  Character,
  CharacterProfile,
  Element,
  Region,
  Talent,
  Weapon,
} from '@teyvatdev/types';

import type {
  BaseOptions,
  CUID,
  FlushOptions,
  TeyvatConstructorOptions,
  Token,
} from './types';
import queue from './helpers/queue';
import flushCache from './methods/flushCache';
import cacheAll from './methods/cacheAll';
import ready from './methods/ready';
import retry from './helpers/retry';
import { getCharacter, getCharacters } from './entities/character';
import { getWeapon, getWeapons } from './entities/weapon';
import { getRegion, getRegions } from './entities/region';
import { getElement, getElements } from './entities/element';
import { getTalent, getTalents } from './entities/talent';
import {
  getCharacterProfile,
  getCharacterProfiles,
} from './entities/characterProfile';
import errorHandler from './methods/errorHandler';

/**
 * ## TS Example
 *
 * ```
 * import Teyvat from '@teyvatdev/node-sdk';
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
 * const Teyvat = require('@teyvatdev/node-sdk');
 * const tey = new Teyvat('Token Here');
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

class Teyvat {
  // Base URL
  readonly base!: string;

  // Teyvat API Token
  protected _token!: Token;

  //all methods below this point
  //each cache has an index of null, which is assigned to the default caller for the methods that dont require parameters. AKA getCharacters(), without parameter options.
  //TODO Add lifetime for the cached requests so they can be refreshed, in case there are any updates in the API's database, a setInterval every couple hours would be preferred over checking on every request has reached its lifetime
  protected _charactersCache!: Map<string | null, Character | Character[]>;

  protected _weaponsCache!: Map<string | null, Weapon | Weapon[]>;

  protected _regionsCache!: Map<string | null, Region | Region[]>;

  protected _elementsCache!: Map<string | null, Element | Element[]>;

  protected _talentsCache!: Map<string | null, Talent | Talent[]>;

  protected _charactersProfilesCache!: Map<
    string | null,
    CharacterProfile | CharacterProfile[]
  >;

  public getCharacter!: (
    name: string,
    options?: BaseOptions
  ) => Promise<Character | undefined>;

  public getCharacters!: (
    options?: BaseOptions
  ) => Promise<Character[] | undefined>;

  public getWeapon!: (
    name: string,
    options?: BaseOptions
  ) => Promise<Weapon | undefined>;

  public getWeapons!: (options?: BaseOptions) => Promise<Weapon[] | undefined>;

  public getRegion!: (
    id: CUID,
    options?: BaseOptions
  ) => Promise<Region | undefined>;

  public getRegions!: (options?: BaseOptions) => Promise<Region[] | undefined>;

  public getElement!: (
    id: CUID,
    options?: BaseOptions
  ) => Promise<Region | undefined>;

  public getElements!: (options?: BaseOptions) => Promise<Region[] | undefined>;

  public getTalent!: (
    id: CUID,
    options?: BaseOptions
  ) => Promise<Talent | undefined>;

  public getTalents!: (options?: BaseOptions) => Promise<Talent[] | undefined>;

  public getCharacterProfile!: (
    id: CUID,
    options?: BaseOptions
  ) => Promise<CharacterProfile | undefined>;

  public getCharacterProfiles!: (
    options?: BaseOptions
  ) => Promise<CharacterProfile[] | undefined>;

  public flushCache!: (options?: FlushOptions) => void;

  public cacheAll!: () => Promise<boolean>;

  //Checks for errors, returns true on an error'ed request, returns false on a normalised 200 request
  protected _errorHandler!: (err: any) => boolean;

  // When was last request made
  protected _lastRequest!: number;

  // Current quota left
  protected _quota!: number;

  // Maximum quota
  protected _quotaMax!: number;

  // The amount to be waited for the quota to reset
  protected _gracePeriod!: number;

  // A retry function to delay
  protected _retry!: (delay: number) => Promise<unknown>;

  // The reset timestamp IN SECONDS of when quota resets
  protected _reset!: number;

  protected _silent!: boolean;

  // When client is ready to be used by the user
  protected _ready!: Promise<void>;

  protected _cache!: boolean;

  // When the client has successfully fetched the initial rates from the API
  protected _hasRates!: boolean;

  // TODO: this any
  protected _queue!: any;

  constructor(token: Token, options?: TeyvatConstructorOptions) {
    this._token = token;
    this.base = (options && options.base) || 'https://rest.teyvat.dev/';
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

    this._queue = queue;

    this.flushCache = flushCache.bind(this);

    this.cacheAll = cacheAll.bind(this);

    this._ready = ready.bind(this)();

    this._retry = retry;

    this._errorHandler = errorHandler.bind(this);

    this.getCharacter = getCharacter.bind(this);

    this.getCharacters = getCharacters.bind(this);

    this.getWeapon = getWeapon.bind(this);

    this.getWeapons = getWeapons.bind(this);

    this.getRegion = getRegion.bind(this);

    this.getRegions = getRegions.bind(this);

    this.getElement = getElement.bind(this);

    this.getElements = getElements.bind(this);

    this.getTalent = getTalent.bind(this);

    this.getTalents = getTalents.bind(this);

    this.getCharacterProfile = getCharacterProfile.bind(this);

    this.getCharacterProfiles = getCharacterProfiles.bind(this);

    if (options?.aggressive) {
      setTimeout(() => {
        this.cacheAll().then(result =>
          console.log(
            result
              ? '[TeyvatLib]: Cached all entries'
              : '[TeyvatLib]: Failed to cache all entries'
          )
        );
      }, 30000);
    }
  }
}

export default Teyvat;
