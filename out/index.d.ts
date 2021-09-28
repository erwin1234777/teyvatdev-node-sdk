/// <reference types="node" />
import { AxiosResponse } from 'axios';
import * as teyvatdev from '@teyvatdev/types';
import { EventEmitter } from 'events';
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
    include?: {
        [key: string]: any;
    };
    /**
     * Used internally for aggressive caching
     */
    cache?: boolean;
    select?: {
        [key: string]: any;
    };
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
    getArtifacts: (options?: baseOptions) => Promise<teyvatdev.Artifact[] | undefined>;
    getArtifactSets: (options?: baseOptions) => Promise<teyvatdev.ArtifactSet[] | undefined>;
    flushCache: (options?: flushOptions) => void;
    cacheAll: () => Promise<boolean>;
    _errorHandler: (data: AxiosResponse) => boolean;
    _retry: (delay: number) => Promise<unknown>;
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
