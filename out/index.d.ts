/// <reference types="node" />
import * as teyvatdev from '@teyvatdev/types';
import { AxiosResponse } from 'axios';
import { EventEmitter } from 'events';
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
export declare function login(email: string, password: string): Promise<false | {
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
}>;
export declare function createAccount(email: string, username: string, password: string): Promise<boolean>;
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
    readonly base: string;
    _token: TeyvatToken;
    _charactersCache: Map<string | null, teyvatdev.Character | teyvatdev.Character[]>;
    _artifactsCache: Map<string | null, teyvatdev.Artifact | teyvatdev.Artifact[]>;
    _artifactSetsCache: Map<string | null, teyvatdev.ArtifactSet | teyvatdev.ArtifactSet[]>;
    _weaponsCache: Map<string | null, teyvatdev.Weapon | teyvatdev.Weapon[]>;
    _regionsCache: Map<string | null, teyvatdev.Region | teyvatdev.Region[]>;
    _elementsCache: Map<string | null, teyvatdev.Element | teyvatdev.Element[]>;
    _talentsCache: Map<string | null, teyvatdev.Talent | teyvatdev.Talent[]>;
    _charactersProfilesCache: Map<string | null, teyvatdev.CharacterProfile | teyvatdev.CharacterProfile[]>;
    getCharacter: (name: string) => Promise<teyvatdev.Character | undefined>;
    getCharacters: () => Promise<teyvatdev.Character[] | undefined>;
    getWeapon: (name: string) => Promise<teyvatdev.Weapon | undefined>;
    getWeapons: () => Promise<teyvatdev.Weapon[] | undefined>;
    getRegion: (id: CUID) => Promise<teyvatdev.Region | undefined>;
    getRegions: () => Promise<teyvatdev.Region[] | undefined>;
    getElement: (id: CUID) => Promise<teyvatdev.Region | undefined>;
    getElements: () => Promise<teyvatdev.Region[] | undefined>;
    getTalent: (id: CUID) => Promise<teyvatdev.Talent | undefined>;
    getTalents: () => Promise<teyvatdev.Talent[] | undefined>;
    getCharacterProfile: (id: CUID) => Promise<teyvatdev.CharacterProfile | undefined>;
    getCharacterProfiles: () => Promise<teyvatdev.CharacterProfile[] | undefined>;
    getArtifacts: () => Promise<teyvatdev.Artifact[] | undefined>;
    getArtifactSets: () => Promise<teyvatdev.ArtifactSet[] | undefined>;
    flushCache: (options?: flushOptions) => void;
    baseRequest: (param: {
        endpoint: string;
        name?: string;
        skipCacheCheck?: boolean;
        dontCache?: boolean;
        cache: Map<any, any>;
        body?: {
            [key: string]: any;
        };
        params?: {
            [key: string]: any;
        };
    }) => Promise<any>;
    setSkips: (fn: Function, payload: any) => Promise<any>;
    cacheAll: () => Promise<boolean>;
    _errorHandler: (data: AxiosResponse) => boolean;
    _retry: (delay: number) => Promise<unknown>;
    createAccount: (email: string, username: string, password: string) => Promise<boolean>;
    login: (email: string, password: string) => Promise<false | {
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
    }>;
    _lastRequest: number;
    _quota: number;
    _quotaMax: number;
    _gracePeriod: number;
    _reset: number;
    _silent: boolean;
    _ready: Promise<void>;
    _cache: boolean;
    _hasRates: boolean;
    _queue: any;
    constructor(token: TeyvatToken, options?: TeyvatConstructorOptions);
}
export {};
