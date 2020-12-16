import * as teyvatdev from '@teyvatdev/types';
declare abstract class baseOptions {
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
interface TeyvatConstructorOptions {
    aggressive?: boolean;
}
declare type CUID = string;
declare type TeyvatToken = string;
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
export declare class Teyvat {
    readonly base: string;
    private _token;
    private _charactersCache;
    private _weaponsCache;
    private _regionsCache;
    private _elementsCache;
    private _talentsCache;
    private _charactersProfilesCache;
    getCharacter: (name: string, options?: baseOptions) => Promise<teyvatdev.Character | undefined>;
    getCharacters: (options?: baseOptions) => Promise<teyvatdev.Character[] | undefined>;
    /**
     *
     * CAREFULL //TODO path's are going to be deprecated in favor of params, make sure the path exists or you'll get 404's, use ID's
     *
     */
    getWeapon: (name: string, options?: baseOptions) => Promise<teyvatdev.Weapon | undefined>;
    getWeapons: (options?: baseOptions) => Promise<teyvatdev.Weapon[] | undefined>;
    getRegion: (id: CUID, options?: baseOptions) => Promise<teyvatdev.Region | undefined>;
    getRegions: (options?: baseOptions) => Promise<teyvatdev.Region[] | undefined>;
    getElement: (id: CUID, options?: baseOptions) => Promise<teyvatdev.Region | undefined>;
    getElements: (options?: baseOptions) => Promise<teyvatdev.Region[] | undefined>;
    getTalent: (id: CUID, options?: baseOptions) => Promise<teyvatdev.Talent | undefined>;
    getTalents: (options?: baseOptions) => Promise<teyvatdev.Talent[] | undefined>;
    getCharacterProfile: (id: CUID, options?: baseOptions) => Promise<teyvatdev.CharacterProfile | undefined>;
    getCharacterProfiles: (options?: baseOptions) => Promise<teyvatdev.CharacterProfile[] | undefined>;
    flushCache: (options?: string) => void;
    cacheAll: () => Promise<boolean>;
    private _lastRequest;
    private _quota;
    private _quotaMax;
    private _gracePeriod;
    private _retry;
    private _reset;
    constructor(token: TeyvatToken, options?: TeyvatConstructorOptions);
}
export {};
