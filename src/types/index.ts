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
  aggressive?: boolean;
  base?: string;
}

export type CUID = string;

export type Token = string;
