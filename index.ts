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
export class Teyvat {
  base!: string;
  _token!: string;
  getCharacter!: (
    name: string,
    options?: baseOptions
  ) => Promise<teyvatdev.Character | undefined>;
  getCharacters!: (
    options?: baseOptions
  ) => Promise<teyvatdev.Character[] | undefined>;
  /**
   *
   * CAREFULL //TODO path's are going to be deprecated in favor of params, make sure the path exists or you'll get 404's, use ID's
   *
   */
  getWeapon!: (
    name: string,
    options?: baseOptions
  ) => Promise<teyvatdev.Weapon | undefined>;
  getWeapons!: (
    options?: baseOptions
  ) => Promise<teyvatdev.Weapon[] | undefined>;
  getRegion!: (
    id: CUID,
    options?: baseOptions
  ) => Promise<teyvatdev.Region | undefined>;
  getRegions!: (
    options?: baseOptions
  ) => Promise<teyvatdev.Region[] | undefined>;
  getElement!: (
    id: CUID,
    options?: baseOptions
  ) => Promise<teyvatdev.Region | undefined>;
  getElements!: (
    options?: baseOptions
  ) => Promise<teyvatdev.Region[] | undefined>;
  getTalent!: (
    id: CUID,
    options?: baseOptions
  ) => Promise<teyvatdev.Talent | undefined>;
  getTalents!: (
    options?: baseOptions
  ) => Promise<teyvatdev.Talent[] | undefined>;
  getCharacterProfile!: (
    id: CUID,
    options?: baseOptions
  ) => Promise<teyvatdev.CharacterProfile | undefined>;
  getCharacterProfiles!: (
    options?: baseOptions
  ) => Promise<teyvatdev.CharacterProfile[] | undefined>;
  _lastRequest!: number;
  _quota!: number;
  _quotaMax!: number;
  _gracePeriod!: number;
  _retry!: () => Promise<void>;
  _reset!: number;
  constructor(token: TeyvatToken) {
    this._token = token;
    this.base = 'https://rest.teyvat.dev/';
    this._lastRequest = Date.now();
    this._quota = 0;
    this._quotaMax = 100;
    this._gracePeriod = 15 * 60 * 1000;
    this._reset = Date.now();
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
    this._retry = () => {
      return new Promise((resolve, reject) => {
        if (Date.now() > this._reset) resolve();
        else
          setTimeout(() => {
            resolve();
          }, this._reset - Date.now());
      });
    };
    this.getCharacter = async function getCharacter(
      name: string,
      /**
       * Options: //TODO check options here
       *
       */
      options?: baseOptions
    ): Promise<teyvatdev.Character | undefined> {
      if (this._quota < 4) await this._retry();
      else this._quota--;
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
      if (data.headers['x-ratelimit-reset'])
        this._reset = data.headers['x-ratelimit-reset'];
      console.log(data);
      return data?.data as undefined | teyvatdev.Character;
    };
    this.getCharacters = async function getCharacters(
      /**
       * Options: //TODO check options here
       *
       */
      options?: baseOptions
    ): Promise<teyvatdev.Character[] | undefined> {
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
      return data?.data as undefined | teyvatdev.Weapon;
    };
    this.getWeapons = async function getWeapons(
      /**
       * Options: //TODO check options here
       *
       */
      options?: baseOptions
    ): Promise<teyvatdev.Weapon[] | undefined> {
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
      return data?.data as undefined | teyvatdev.Region;
    };
    this.getRegions = async function getRegions(
      /**
       * Options: //TODO check options here
       *
       */
      options?: baseOptions
    ): Promise<teyvatdev.Region[] | undefined> {
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
      return data?.data as undefined | teyvatdev.Element;
    };
    this.getElements = async function getElements(
      /**
       * Options: //TODO check options here
       *
       */
      options?: baseOptions
    ): Promise<teyvatdev.Element[] | undefined> {
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
      return data?.data as undefined | teyvatdev.Talent;
    };
    this.getTalents = async function getTalents(
      /**
       * Options: //TODO check options here
       *
       */
      options?: baseOptions
    ): Promise<teyvatdev.Talent[] | undefined> {
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
      return data?.data as undefined | teyvatdev.CharacterProfile;
    };
    this.getCharacterProfiles = async function getCharacterProfiles(
      /**
       * Options: //TODO check options here
       *
       */
      options?: baseOptions
    ): Promise<teyvatdev.CharacterProfile[] | undefined> {
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
      return data?.data as undefined | teyvatdev.CharacterProfile[];
    };
  }
}
