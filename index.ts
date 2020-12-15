import axios from 'axios';
import * as teyvatdev from '@teyvatdev/types';
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
export class Teyvat {
  //Base URL
  readonly base!: string;
  //TEYVAT token
  private _token!: TeyvatToken;
  //all methods below this point
  public getCharacter!: (
    name: string,
    options?: baseOptions
  ) => Promise<teyvatdev.Character | undefined>;
  public getCharacters!: (
    options?: baseOptions
  ) => Promise<teyvatdev.Character[] | undefined>;
  /**
   *
   * CAREFULL //TODO path's are going to be deprecated in favor of params, make sure the path exists or you'll get 404's, use ID's
   *
   */
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
  constructor(token: TeyvatToken) {
    this._token = token;
    this.base = 'https://rest.teyvat.dev/';
    this._lastRequest = Date.now();
    this._quota = 0;
    this._quotaMax = 100;
    this._gracePeriod = 15 * 60 * 1000;
    this._reset = Math.ceil(Date.now() / 1000) + 900;
    (async () => {
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
    this.getCharacter = async function getCharacter(
      name: string,
      /**
       * Options: //TODO check options here
       *
       */
      options?: baseOptions
    ): Promise<teyvatdev.Character | undefined> {
      if (this._quota < 4)
        await this._retry(
          Math.ceil(this._reset) - Math.ceil(Date.now() / 1000)
        );
      let data = undefined;
      try {
        data = await axios.get(this.base + 'character', {
          headers: {
            Authorization: 'Bearer ' + this._token,
          },
          params: {
            name: name,
            ...options,
          },
        });
      } catch (er) {
        console.log(er);
        throw Error(er);
      }
      if (data) {
        if (data.headers['x-ratelimit-remaining'] !== undefined)
          this._quota = data.headers['x-ratelimit-remaining'];
        if (data.headers['x-ratelimit-limit'] !== undefined)
          this._quotaMax = data.headers['x-ratelimit-limit'];
        if (data.headers['x-ratelimit-reset'] !== undefined)
          this._reset = data.headers['x-ratelimit-reset'];
      }
      return data?.data as undefined | teyvatdev.Character;
    };
    this.getCharacters = async function getCharacters(
      /**
       * Options: //TODO check options here
       *
       */
      options?: baseOptions
    ): Promise<teyvatdev.Character[] | undefined> {
      if (this._quota < 4)
        await this._retry(
          Math.ceil(this._reset) - Math.ceil(Date.now() / 1000)
        );
      let data = undefined;
      try {
        data = await axios.get(this.base + 'characters', {
          headers: {
            Authorization: 'Bearer ' + this._token,
          },
          params: {
            ...options,
          },
        });
      } catch (er) {
        console.log(er);
        throw Error(er);
      }
      if (data) {
        if (data.headers['x-ratelimit-remaining'] !== undefined)
          this._quota = data.headers['x-ratelimit-remaining'];
        if (data.headers['x-ratelimit-limit'] !== undefined)
          this._quotaMax = data.headers['x-ratelimit-limit'];
        if (data.headers['x-ratelimit-reset'] !== undefined)
          this._reset = data.headers['x-ratelimit-reset'];
      }
      return data?.data as undefined | teyvatdev.Character[];
    };
    this.getWeapon = async function getWeapon(
      id: CUID,
      /**
       * Options: //TODO check options here
       *
       */
      options?: baseOptions
    ): Promise<teyvatdev.Weapon | undefined> {
      if (this._quota < 4)
        await this._retry(
          Math.ceil(this._reset) - Math.ceil(Date.now() / 1000)
        );
      let data = undefined;
      try {
        data = await axios.get(this.base + 'weapon/' + id, {
          headers: {
            Authorization: 'Bearer ' + this._token,
          },
          params: {
            ...options,
          },
        });
      } catch (er) {
        console.log(er);
        throw Error(er);
      }
      if (data) {
        if (data.headers['x-ratelimit-remaining'] !== undefined)
          this._quota = data.headers['x-ratelimit-remaining'];
        if (data.headers['x-ratelimit-limit'] !== undefined)
          this._quotaMax = data.headers['x-ratelimit-limit'];
        if (data.headers['x-ratelimit-reset'] !== undefined)
          this._reset = data.headers['x-ratelimit-reset'];
      }
      return data?.data as undefined | teyvatdev.Weapon;
    };
    this.getWeapons = async function getWeapons(
      /**
       * Options: //TODO check options here
       *
       */
      options?: baseOptions
    ): Promise<teyvatdev.Weapon[] | undefined> {
      if (this._quota < 4)
        await this._retry(
          Math.ceil(this._reset) - Math.ceil(Date.now() / 1000)
        );
      let data = undefined;
      try {
        data = await axios.get(this.base + 'weapons', {
          headers: {
            Authorization: 'Bearer ' + this._token,
          },
          params: {
            ...options,
          },
        });
      } catch (er) {
        console.log(er);
        throw Error(er);
      }
      if (data) {
        if (data.headers['x-ratelimit-remaining'] !== undefined)
          this._quota = data.headers['x-ratelimit-remaining'];
        if (data.headers['x-ratelimit-limit'] !== undefined)
          this._quotaMax = data.headers['x-ratelimit-limit'];
        if (data.headers['x-ratelimit-reset'] !== undefined)
          this._reset = data.headers['x-ratelimit-reset'];
      }
      return data?.data as undefined | teyvatdev.Weapon[];
    };
    this.getRegion = async function getRegion(
      id: CUID,
      /**
       * Options: //TODO check options here
       *
       */
      options?: baseOptions
    ): Promise<teyvatdev.Region | undefined> {
      if (this._quota < 4)
        await this._retry(
          Math.ceil(this._reset) - Math.ceil(Date.now() / 1000)
        );
      let data = undefined;
      try {
        data = await axios.get(this.base + 'region/' + id, {
          headers: {
            Authorization: 'Bearer ' + this._token,
          },
          params: {
            ...options,
          },
        });
      } catch (er) {
        console.log(er);
        throw Error(er);
      }
      if (data) {
        if (data.headers['x-ratelimit-remaining'] !== undefined)
          this._quota = data.headers['x-ratelimit-remaining'];
        if (data.headers['x-ratelimit-limit'] !== undefined)
          this._quotaMax = data.headers['x-ratelimit-limit'];
        if (data.headers['x-ratelimit-reset'] !== undefined)
          this._reset = data.headers['x-ratelimit-reset'];
      }
      return data?.data as undefined | teyvatdev.Region;
    };
    this.getRegions = async function getRegions(
      /**
       * Options: //TODO check options here
       *
       */
      options?: baseOptions
    ): Promise<teyvatdev.Region[] | undefined> {
      if (this._quota < 4)
        await this._retry(
          Math.ceil(this._reset) - Math.ceil(Date.now() / 1000)
        );
      let data = undefined;
      try {
        data = await axios.get(this.base + 'regions', {
          headers: {
            Authorization: 'Bearer ' + this._token,
          },
          params: {
            ...options,
          },
        });
      } catch (er) {
        console.log(er);
        throw Error(er);
      }
      if (data) {
        if (data.headers['x-ratelimit-remaining'] !== undefined)
          this._quota = data.headers['x-ratelimit-remaining'];
        if (data.headers['x-ratelimit-limit'] !== undefined)
          this._quotaMax = data.headers['x-ratelimit-limit'];
        if (data.headers['x-ratelimit-reset'] !== undefined)
          this._reset = data.headers['x-ratelimit-reset'];
      }
      return data?.data as undefined | teyvatdev.Region[];
    };
    this.getElement = async function getElement(
      id: string,
      /**
       * Options: //TODO check options here
       *
       */
      options?: baseOptions
    ): Promise<teyvatdev.Element | undefined> {
      if (this._quota < 4)
        await this._retry(
          Math.ceil(this._reset) - Math.ceil(Date.now() / 1000)
        );
      let data = undefined;
      try {
        data = await axios.get(this.base + 'element/' + id, {
          headers: {
            Authorization: 'Bearer ' + this._token,
          },
          params: {
            ...options,
          },
        });
      } catch (er) {
        console.log(er);
        throw Error(er);
      }
      if (data) {
        if (data.headers['x-ratelimit-remaining'] !== undefined)
          this._quota = data.headers['x-ratelimit-remaining'];
        if (data.headers['x-ratelimit-limit'] !== undefined)
          this._quotaMax = data.headers['x-ratelimit-limit'];
        if (data.headers['x-ratelimit-reset'] !== undefined)
          this._reset = data.headers['x-ratelimit-reset'];
      }
      return data?.data as undefined | teyvatdev.Element;
    };
    this.getElements = async function getElements(
      /**
       * Options: //TODO check options here
       *
       */
      options?: baseOptions
    ): Promise<teyvatdev.Element[] | undefined> {
      if (this._quota < 4)
        await this._retry(
          Math.ceil(this._reset) - Math.ceil(Date.now() / 1000)
        );
      let data = undefined;
      try {
        data = await axios.get(this.base + 'elements', {
          headers: {
            Authorization: 'Bearer ' + this._token,
          },
          params: {
            ...options,
          },
        });
      } catch (er) {
        console.log(er);
        throw Error(er);
      }
      if (data) {
        if (data.headers['x-ratelimit-remaining'] !== undefined)
          this._quota = data.headers['x-ratelimit-remaining'];
        if (data.headers['x-ratelimit-limit'] !== undefined)
          this._quotaMax = data.headers['x-ratelimit-limit'];
        if (data.headers['x-ratelimit-reset'] !== undefined)
          this._reset = data.headers['x-ratelimit-reset'];
      }
      return data?.data as undefined | teyvatdev.Element[];
    };
    this.getTalent = async function getTalent(
      id: CUID,
      /**
       * Options: //TODO check options here
       *
       */
      options?: baseOptions
    ): Promise<teyvatdev.Talent | undefined> {
      if (this._quota < 4)
        await this._retry(
          Math.ceil(this._reset) - Math.ceil(Date.now() / 1000)
        );
      let data = undefined;
      try {
        data = await axios.get(this.base + 'talent/' + id, {
          headers: {
            Authorization: 'Bearer ' + this._token,
          },
          params: {
            ...options,
          },
        });
      } catch (er) {
        console.log(er);
        throw Error(er);
      }
      if (data) {
        if (data.headers['x-ratelimit-remaining'] !== undefined)
          this._quota = data.headers['x-ratelimit-remaining'];
        if (data.headers['x-ratelimit-limit'] !== undefined)
          this._quotaMax = data.headers['x-ratelimit-limit'];
        if (data.headers['x-ratelimit-reset'] !== undefined)
          this._reset = data.headers['x-ratelimit-reset'];
      }
      return data?.data as undefined | teyvatdev.Talent;
    };
    this.getTalents = async function getTalents(
      /**
       * Options: //TODO check options here
       *
       */
      options?: baseOptions
    ): Promise<teyvatdev.Talent[] | undefined> {
      if (this._quota < 4)
        await this._retry(
          Math.ceil(this._reset) - Math.ceil(Date.now() / 1000)
        );
      let data = undefined;
      try {
        data = await axios.get(this.base + 'talents', {
          headers: {
            Authorization: 'Bearer ' + this._token,
          },
          params: {
            ...options,
          },
        });
      } catch (er) {
        console.log(er);
        throw Error(er);
      }
      if (data) {
        if (data.headers['x-ratelimit-remaining'] !== undefined)
          this._quota = data.headers['x-ratelimit-remaining'];
        if (data.headers['x-ratelimit-limit'] !== undefined)
          this._quotaMax = data.headers['x-ratelimit-limit'];
        if (data.headers['x-ratelimit-reset'] !== undefined)
          this._reset = data.headers['x-ratelimit-reset'];
      }
      return data?.data as undefined | teyvatdev.Talent[];
    };
    this.getCharacterProfile = async function getCharacterProfile(
      id: CUID,
      /**
       * Options: //TODO check options here
       *
       */
      options?: baseOptions
    ): Promise<teyvatdev.CharacterProfile | undefined> {
      if (this._quota < 4)
        await this._retry(
          Math.ceil(this._reset) - Math.ceil(Date.now() / 1000)
        );
      let data = undefined;
      try {
        data = await axios.get(this.base + 'characterProfile/' + id, {
          headers: {
            Authorization: 'Bearer ' + this._token,
          },
          params: {
            ...options,
          },
        });
      } catch (er) {
        console.log(er);
        throw Error(er);
      }
      if (data) {
        if (data.headers['x-ratelimit-remaining'] !== undefined)
          this._quota = data.headers['x-ratelimit-remaining'];
        if (data.headers['x-ratelimit-limit'] !== undefined)
          this._quotaMax = data.headers['x-ratelimit-limit'];
        if (data.headers['x-ratelimit-reset'] !== undefined)
          this._reset = data.headers['x-ratelimit-reset'];
      }
      return data?.data as undefined | teyvatdev.CharacterProfile;
    };
    this.getCharacterProfiles = async function getCharacterProfiles(
      /**
       * Options: //TODO check options here
       *
       */
      options?: baseOptions
    ): Promise<teyvatdev.CharacterProfile[] | undefined> {
      if (this._quota < 4)
        await this._retry(
          Math.ceil(this._reset) - Math.ceil(Date.now() / 1000)
        );
      let data = undefined;
      try {
        data = await axios.get(this.base + 'characterProfiles', {
          headers: {
            Authorization: 'Bearer ' + this._token,
          },
          params: {
            ...options,
          },
        });
      } catch (er) {
        console.log(er);
        throw Error(er);
      }
      if (data) {
        if (data.headers['x-ratelimit-remaining'] !== undefined)
          this._quota = data.headers['x-ratelimit-remaining'];
        if (data.headers['x-ratelimit-limit'] !== undefined)
          this._quotaMax = data.headers['x-ratelimit-limit'];
        if (data.headers['x-ratelimit-reset'] !== undefined)
          this._reset = data.headers['x-ratelimit-reset'];
      }
      return data?.data as undefined | teyvatdev.CharacterProfile[];
    };
  }
}
