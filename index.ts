import axios from 'axios';
import * as teyvatdev from '@teyvatdev/types';
interface baseOptions {
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

export class Teyvat {
  base!: string;
  _token!: string;
  getCharacter!: (
    name: string,
    options?: baseOptions
  ) => Promise<teyvatdev.Character | undefined>;
  constructor(token: string) {
    this._token = token;
    this.base = 'https://rest.teyvat.dev/';
    this.getCharacter = async function getCharacter(
      name: string,
      /**
       * Options: //TODO check options here
       *
       *
       *
       */
      options?: baseOptions
    ): Promise<teyvatdev.Character | undefined> {
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
      return data?.data as undefined | teyvatdev.Character;
    };
  }
}
