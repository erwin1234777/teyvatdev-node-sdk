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
declare type flushOptions = 'all' | [
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
declare type CUID = string;
declare type TeyvatToken = string;
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
export declare class Register {
    registerUser: (email?: string, password?: string) => Promise<string | null>;
    getToken: (email?: string, password?: string) => Promise<TeyvatToken | null>;
    base: string;
    _email: string;
    _password: string;
    constructor(email: string, password: string);
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
    readonly base: string;
    private _token;
    private _charactersCache;
    private _weaponsCache;
    private _regionsCache;
    private _elementsCache;
    private _talentsCache;
    private _charactersProfilesCache;
    getToken: (email: string, password: string) => Promise<TeyvatToken>;
    getCharacter: (name: string, options?: baseOptions) => Promise<teyvatdev.Character | undefined>;
    getCharacters: (options?: baseOptions) => Promise<teyvatdev.Character[] | undefined>;
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
    flushCache: (options?: flushOptions) => void;
    cacheAll: () => Promise<boolean>;
    private _errorHandler;
    private _lastRequest;
    private _quota;
    private _quotaMax;
    private _gracePeriod;
    private _retry;
    private _reset;
    private _silent;
    private _ready;
    private _cache;
    private _hasRates;
    private _queue;
    constructor(token: TeyvatToken, options?: TeyvatConstructorOptions);
}
export {};
