"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Teyvat = void 0;
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
const async = tslib_1.__importStar(require("async"));
//TODO IMPORTANT check axios response if it contains errors (200 OK)
class baseOptions {
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
class Teyvat {
    constructor(token, options) {
        this._token = token;
        this.base = 'https://rest.teyvat.dev/';
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
        this._queue = async.queue(async (fn) => {
            return await fn();
        }, 1);
        this.flushCache = function flushCache(options) {
            if (!options) {
                this._charactersCache = new Map();
                this._weaponsCache = new Map();
                this._regionsCache = new Map();
                this._elementsCache = new Map();
                this._talentsCache = new Map();
                this._charactersProfilesCache = new Map();
            }
            else {
                switch (options) {
                    //TODO ADD specific cache flushing here
                    case '': {
                        break;
                    }
                }
            }
        };
        this.cacheAll = async function cacheAll() {
            return new Promise(async (res) => {
                if (this._quota < 6)
                    res(false);
                else {
                    await this.getCharacters({ take: 300, cache: true });
                    await this.getWeapons({ take: 300, cache: true });
                    await this.getRegions({ take: 300, cache: true });
                    await this.getElements({ take: 300, cache: true });
                    await this.getTalents({ take: 300, cache: true });
                    await this.getCharacterProfiles({ take: 300, cache: true });
                    res(true);
                }
            });
        };
        this._ready = (async () => {
            //dummy request
            let fetchRates = await axios_1.default.get(this.base + 'character', {
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
        this._retry = (delay) => new Promise((resolve) => {
            if (Math.sign(delay) === -1)
                delay = 900;
            setTimeout(resolve, Math.ceil(delay) * 1000);
        });
        this.getCharacter = async function getCharacter(name, 
        /**
         * Options:
         *
         */
        options) {
            //checking if cache has that character
            if (this._charactersCache.has(name) && !options)
                return this._charactersCache.get(name);
            //checking for quota, if its lower than 4, wait until next reset
            if (this._quota < 4 && this._hasRates)
                await this._retry(Math.ceil(this._reset) - Math.ceil(Date.now() / 1000));
            let data = undefined;
            try {
                data = await this._queue.push(async () => {
                    return await axios_1.default.get(this.base + 'character', {
                        headers: {
                            Authorization: 'Bearer ' + this._token,
                        },
                        params: {
                            name: name,
                            ...options,
                        },
                    });
                });
            }
            catch (er) {
                console.log(er);
                throw Error(er);
            }
            if (data) {
                this._hasRates = true;
                if (data.headers['x-ratelimit-remaining'] !== undefined)
                    this._quota = data.headers['x-ratelimit-remaining'];
                if (data.headers['x-ratelimit-limit'] !== undefined)
                    this._quotaMax = data.headers['x-ratelimit-limit'];
                if (data.headers['x-ratelimit-reset'] !== undefined)
                    this._reset = data.headers['x-ratelimit-reset'];
                //if data has been returned(aka not null) and there are no custom options, set cache
                if ((!options && data.data) || options?.cache)
                    this._charactersCache.set(name, data.data);
            }
            return data?.data;
        };
        this.getCharacters = async function getCharacters(
        /**
         * Options:
         *
         */
        options) {
            //ensures that if theres already been a search on _charactersCache that it saves up on a request;
            if (this._charactersCache.has(null) && !options)
                return this._charactersCache.get(null);
            //quota checker, if quota is lower than 4, await for next reset before attempting it.
            if (this._quota < 4)
                await this._retry(Math.ceil(this._reset) - Math.ceil(Date.now() / 1000));
            let data = undefined;
            try {
                data = await this._queue.push(async () => {
                    return await axios_1.default.get(this.base + 'characters', {
                        headers: {
                            Authorization: 'Bearer ' + this._token,
                        },
                        params: {
                            ...options,
                        },
                    });
                });
            }
            catch (er) {
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
                //setting cache on normal request
                if ((!options && data.data) || options?.cache) {
                    this._charactersCache.set(null, data.data);
                    for (let d of data.data)
                        this._charactersCache.set(d.name, d);
                }
            }
            return data?.data;
        };
        this.getWeapon = async function getWeapon(id, 
        /**
         * Options:
         *
         */
        options) {
            //checking if cache has that character
            if (this._weaponsCache.has(id) && !options)
                return this._weaponsCache.get(id);
            //checking for quota, if its lower than 4, wait until next reset
            if (this._quota < 4)
                await this._retry(Math.ceil(this._reset) - Math.ceil(Date.now() / 1000));
            let data = undefined;
            try {
                data = await this._queue.push(async () => {
                    return await axios_1.default.get(this.base + 'weapon/' + id, {
                        headers: {
                            Authorization: 'Bearer ' + this._token,
                        },
                        params: {
                            ...options,
                        },
                    });
                });
            }
            catch (er) {
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
                //if data has been returned(aka not null) and there are no custom options, set cache
                if ((!options && data.data) || options?.cache)
                    this._weaponsCache.set(id, data.data);
            }
            return data?.data;
        };
        this.getWeapons = async function getWeapons(
        /**
         * Options:
         *
         */
        options) {
            //ensures that if theres already been a search on _cweaponsCache that it saves up on a request;
            if (this._weaponsCache.has(null) && !options)
                return this._weaponsCache.get(null);
            //quota checker, if quota is lower than 4, await for next reset before attempting it.
            if (this._quota < 4)
                await this._retry(Math.ceil(this._reset) - Math.ceil(Date.now() / 1000));
            let data = undefined;
            try {
                data = await this._queue.push(async () => {
                    return await axios_1.default.get(this.base + 'weapons', {
                        headers: {
                            Authorization: 'Bearer ' + this._token,
                        },
                        params: {
                            ...options,
                        },
                    });
                });
            }
            catch (er) {
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
                //setting cache on normal request
                if ((!options && data.data) || options?.cache) {
                    this._weaponsCache.set(null, data.data);
                    for (let d of data.data)
                        this._weaponsCache.set(d.id, d);
                }
            }
            return data?.data;
        };
        this.getRegion = async function getRegion(id, 
        /**
         * Options:
         *
         */
        options) {
            //checking if cache has that character
            if (this._regionsCache.has(id) && !options)
                return this._regionsCache.get(id);
            //checking for quota, if its lower than 4, wait until next reset
            if (this._quota < 4)
                await this._retry(Math.ceil(this._reset) - Math.ceil(Date.now() / 1000));
            let data = undefined;
            try {
                data = await this._queue.push(async () => {
                    return await axios_1.default.get(this.base + 'region/' + id, {
                        headers: {
                            Authorization: 'Bearer ' + this._token,
                        },
                        params: {
                            ...options,
                        },
                    });
                });
            }
            catch (er) {
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
                //if data has been returned(aka not null) and there are no custom options, set cache
                if ((!options && data.data) || options?.cache)
                    this._regionsCache.set(id, data.data);
            }
            return data?.data;
        };
        this.getRegions = async function getRegions(
        /**
         * Options:
         *
         */
        options) {
            //ensures that if theres already been a search on _regionCache that it saves up on a request;
            if (this._regionsCache.has(null) && !options)
                return this._regionsCache.get(null);
            //quota checker, if quota is lower than 4, await for next reset before attempting it.
            if (this._quota < 4)
                await this._retry(Math.ceil(this._reset) - Math.ceil(Date.now() / 1000));
            let data = undefined;
            try {
                data = await this._queue.push(async () => {
                    return await axios_1.default.get(this.base + 'regions', {
                        headers: {
                            Authorization: 'Bearer ' + this._token,
                        },
                        params: {
                            ...options,
                        },
                    });
                });
            }
            catch (er) {
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
                //setting cache on normal request
                if ((!options && data.data) || options?.cache) {
                    this._regionsCache.set(null, data.data);
                    for (let d of data.data)
                        this._regionsCache.set(d.id, d);
                }
            }
            return data?.data;
        };
        this.getElement = async function getElement(id, 
        /**
         * Options:
         *
         */
        options) {
            //checking if cache has that character
            if (this._elementsCache.has(id) && !options)
                return this._elementsCache.get(id);
            //checking for quota, if its lower than 4, wait until next reset
            if (this._quota < 4)
                await this._retry(Math.ceil(this._reset) - Math.ceil(Date.now() / 1000));
            let data = undefined;
            try {
                data = await this._queue.push(async () => {
                    return await axios_1.default.get(this.base + 'element/' + id, {
                        headers: {
                            Authorization: 'Bearer ' + this._token,
                        },
                        params: {
                            ...options,
                        },
                    });
                });
            }
            catch (er) {
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
                //if data has been returned(aka not null) and there are no custom options, set cache
                if ((!options && data.data) || options?.cache)
                    this._elementsCache.set(id, data.data);
            }
            return data?.data;
        };
        this.getElements = async function getElements(
        /**
         * Options:
         *
         */
        options) {
            //ensures that if theres already been a search on _elementsCache that it saves up on a request;
            if (this._elementsCache.has(null) && !options)
                return this._elementsCache.get(null);
            //quota checker, if quota is lower than 4, await for next reset before attempting it.
            if (this._quota < 4)
                await this._retry(Math.ceil(this._reset) - Math.ceil(Date.now() / 1000));
            let data = undefined;
            try {
                data = await this._queue.push(async () => {
                    return await axios_1.default.get(this.base + 'elements', {
                        headers: {
                            Authorization: 'Bearer ' + this._token,
                        },
                        params: {
                            ...options,
                        },
                    });
                });
            }
            catch (er) {
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
                //setting cache on normal request
                if ((!options && data.data) || options?.cache) {
                    this._elementsCache.set(null, data.data);
                    for (let d of data.data)
                        this._elementsCache.set(d.id, d);
                }
            }
            return data?.data;
        };
        this.getTalent = async function getTalent(id, 
        /**
         * Options:
         *
         */
        options) {
            //checking if cache has that character
            if (this._talentsCache.has(id) && !options)
                return this._talentsCache.get(id);
            //checking for quota, if its lower than 4, wait until next reset
            if (this._quota < 4)
                await this._retry(Math.ceil(this._reset) - Math.ceil(Date.now() / 1000));
            let data = undefined;
            try {
                data = await this._queue.push(async () => {
                    return await axios_1.default.get(this.base + 'talent/' + id, {
                        headers: {
                            Authorization: 'Bearer ' + this._token,
                        },
                        params: {
                            ...options,
                        },
                    });
                });
            }
            catch (er) {
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
                //if data has been returned(aka not null) and there are no custom options, set cache
                if ((!options && data.data) || options?.cache)
                    this._talentsCache.set(id, data.data);
            }
            return data?.data;
        };
        this.getTalents = async function getTalents(
        /**
         * Options:
         *
         */
        options) {
            //ensures that if theres already been a search on _talentsCache that it saves up on a request;
            if (this._talentsCache.has(null) && !options)
                return this._talentsCache.get(null);
            //quota checker, if quota is lower than 4, await for next reset before attempting it.
            if (this._quota < 4)
                await this._retry(Math.ceil(this._reset) - Math.ceil(Date.now() / 1000));
            let data = undefined;
            try {
                data = await this._queue.push(async () => {
                    return await axios_1.default.get(this.base + 'talents', {
                        headers: {
                            Authorization: 'Bearer ' + this._token,
                        },
                        params: {
                            ...options,
                        },
                    });
                });
            }
            catch (er) {
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
                //setting cache on normal request
                if ((!options && data.data) || options?.cache) {
                    this._talentsCache.set(null, data.data);
                    for (let d of data.data)
                        this._talentsCache.set(d.id, d);
                }
            }
            return data?.data;
        };
        this.getCharacterProfile = async function getCharacterProfile(id, 
        /**
         * Options:
         *
         */
        options) {
            //checking if cache has that character
            if (this._charactersProfilesCache.has(id) && !options)
                return this._charactersProfilesCache.get(id);
            //checking for quota, if its lower than 4, wait until next reset
            if (this._quota < 4)
                await this._retry(Math.ceil(this._reset) - Math.ceil(Date.now() / 1000));
            let data = undefined;
            try {
                data = await this._queue.push(async () => {
                    return await axios_1.default.get(this.base + 'characterProfile/' + id, {
                        headers: {
                            Authorization: 'Bearer ' + this._token,
                        },
                        params: {
                            ...options,
                        },
                    });
                });
            }
            catch (er) {
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
                //if data has been returned(aka not null) and there are no custom options, set cache
                if ((!options && data.data) || options?.cache)
                    this._charactersProfilesCache.set(id, data.data);
            }
            return data?.data;
        };
        this.getCharacterProfiles = async function getCharacterProfiles(
        /**
         * Options:
         *
         */
        options) {
            //ensures that if theres already been a search on _charactersProfilesCache that it saves up on a request;
            if (this._charactersProfilesCache.has(null) && !options)
                return this._charactersProfilesCache.get(null);
            //quota checker, if quota is lower than 4, await for next reset before attempting it.
            if (this._quota < 4)
                await this._retry(Math.ceil(this._reset) - Math.ceil(Date.now() / 1000));
            let data = undefined;
            try {
                data = await this._queue.push(async () => {
                    return await axios_1.default.get(this.base + 'characterProfiles', {
                        headers: {
                            Authorization: 'Bearer ' + this._token,
                        },
                        params: {
                            ...options,
                        },
                    });
                });
            }
            catch (er) {
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
                //setting cache on normal request
                if ((!options && data.data) || options?.cache) {
                    this._charactersProfilesCache.set(null, data.data);
                    for (let d of data.data)
                        this._charactersProfilesCache.set(d.id, d);
                }
            }
            return data?.data;
        };
        if (options?.aggressive) {
            setTimeout(() => {
                this.cacheAll().then((d) => console.log(d
                    ? '[TeyvatLib]: Cached all entries'
                    : '[TeyvatLib]: Failed to cache all entries'));
            }, 30000);
        }
    }
}
exports.Teyvat = Teyvat;
