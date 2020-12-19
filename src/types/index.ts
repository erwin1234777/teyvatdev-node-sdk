export abstract class BaseOptions {
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

export interface TeyvatConstructorOptions {
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
  /**
   * Base url for connecting with the API, Default: rest.teyvat.dev
   */
  base?: string;
}

export type CUID = string;

export type Token = string;

export type FlushOptions =
  | 'all'
  | [
      'characters'?,
      'weapons'?,
      'regions'?,
      'elements'?,
      'talents'?,
      'charactersProfiles'?
    ];
