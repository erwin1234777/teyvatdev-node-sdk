"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Register = void 0;
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
const async = tslib_1.__importStar(require("async"));
class baseOptions {
}
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
class Register {
    constructor(email, password) {
        this.base = 'https://rest.teyvat.dev/';
        this._email = email;
        this._password = password;
        this.registerUser = async function registerUser(email, password) {
            let req = await axios_1.default
                .post(this.base + 'signup', {
                email: email ? email : this._email,
                password: password ? password : this._password,
            })
                .catch((err) => console.log(err.response));
            if (!req || req.data.status !== 200)
                return null;
            else
                return 'Success, please verify the email and do getToken() with same params!';
        };
        this.getToken = async function getToken(email, password) {
            let req = await axios_1.default
                .post(this.base + 'login', {
                email: email ? email : this._email,
                password: password ? password : this._password,
            })
                .catch((err) => console.log(err.response));
            if (!req || req.status !== 200)
                return null;
            else
                return req.data.token;
        };
    }
}
exports.Register = Register;
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
        this._cache = options?.cache !== undefined ? options.cache : true;
        this._silent = options?.silent !== undefined ? options.silent : true;
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
            if (!options || options === 'all') {
                this._charactersCache = new Map();
                this._weaponsCache = new Map();
                this._regionsCache = new Map();
                this._elementsCache = new Map();
                this._talentsCache = new Map();
                this._charactersProfilesCache = new Map();
            }
            else {
                for (let e of options) {
                    switch (e) {
                        case 'characters': {
                            this._charactersCache = new Map();
                            break;
                        }
                        case 'weapons': {
                            this._weaponsCache = new Map();
                            break;
                        }
                        case 'regions': {
                            this._regionsCache = new Map();
                            break;
                        }
                        case 'elements': {
                            this._elementsCache = new Map();
                            break;
                        }
                        case 'charactersProfiles': {
                            this._charactersProfilesCache = new Map();
                            break;
                        }
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
        this._errorHandler = function errorHandler(data) {
            if (this._silent)
                return false; //this is as good as swallowing errors, though the user set the lib in silent mode, need to add WARN/INFO/ERROR levels
            if (data.status === 200)
                return false;
            console.log({ error: data.data.response });
            return true;
        };
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
                this._errorHandler(er);
            }
            if (!this._errorHandler(data))
                return;
            if (data && data.data.status === 200) {
                this._hasRates = true;
                if (data.headers['x-ratelimit-remaining'] !== undefined)
                    this._quota = data.headers['x-ratelimit-remaining'];
                if (data.headers['x-ratelimit-limit'] !== undefined)
                    this._quotaMax = data.headers['x-ratelimit-limit'];
                if (data.headers['x-ratelimit-reset'] !== undefined)
                    this._reset = data.headers['x-ratelimit-reset'];
                //if data has been returned(aka not null) and there are no custom options, set cache
                if (this._cache && ((!options && data.data) || options?.cache))
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
                this._errorHandler(er);
            }
            if (!this._errorHandler(data))
                return;
            if (data) {
                if (data.headers['x-ratelimit-remaining'] !== undefined)
                    this._quota = data.headers['x-ratelimit-remaining'];
                if (data.headers['x-ratelimit-limit'] !== undefined)
                    this._quotaMax = data.headers['x-ratelimit-limit'];
                if (data.headers['x-ratelimit-reset'] !== undefined)
                    this._reset = data.headers['x-ratelimit-reset'];
                //setting cache on normal request
                if (this._cache && ((!options && data.data) || options?.cache)) {
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
                this._errorHandler(er);
            }
            if (!this._errorHandler(data))
                return;
            if (data) {
                if (data.headers['x-ratelimit-remaining'] !== undefined)
                    this._quota = data.headers['x-ratelimit-remaining'];
                if (data.headers['x-ratelimit-limit'] !== undefined)
                    this._quotaMax = data.headers['x-ratelimit-limit'];
                if (data.headers['x-ratelimit-reset'] !== undefined)
                    this._reset = data.headers['x-ratelimit-reset'];
                //if data has been returned(aka not null) and there are no custom options, set cache
                if (this._cache && ((!options && data.data) || options?.cache))
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
                this._errorHandler(er);
            }
            if (!this._errorHandler(data))
                return;
            if (data) {
                if (data.headers['x-ratelimit-remaining'] !== undefined)
                    this._quota = data.headers['x-ratelimit-remaining'];
                if (data.headers['x-ratelimit-limit'] !== undefined)
                    this._quotaMax = data.headers['x-ratelimit-limit'];
                if (data.headers['x-ratelimit-reset'] !== undefined)
                    this._reset = data.headers['x-ratelimit-reset'];
                //setting cache on normal request
                if (this._cache && ((!options && data.data) || options?.cache)) {
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
                this._errorHandler(er);
            }
            if (!this._errorHandler(data))
                return;
            if (data) {
                if (data.headers['x-ratelimit-remaining'] !== undefined)
                    this._quota = data.headers['x-ratelimit-remaining'];
                if (data.headers['x-ratelimit-limit'] !== undefined)
                    this._quotaMax = data.headers['x-ratelimit-limit'];
                if (data.headers['x-ratelimit-reset'] !== undefined)
                    this._reset = data.headers['x-ratelimit-reset'];
                //if data has been returned(aka not null) and there are no custom options, set cache
                if (this._cache && ((!options && data.data) || options?.cache))
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
                this._errorHandler(er);
            }
            if (!this._errorHandler(data))
                return;
            if (data) {
                if (data.headers['x-ratelimit-remaining'] !== undefined)
                    this._quota = data.headers['x-ratelimit-remaining'];
                if (data.headers['x-ratelimit-limit'] !== undefined)
                    this._quotaMax = data.headers['x-ratelimit-limit'];
                if (data.headers['x-ratelimit-reset'] !== undefined)
                    this._reset = data.headers['x-ratelimit-reset'];
                //setting cache on normal request
                if (this._cache && ((!options && data.data) || options?.cache)) {
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
                this._errorHandler(er);
            }
            if (!this._errorHandler(data))
                return;
            if (data) {
                if (data.headers['x-ratelimit-remaining'] !== undefined)
                    this._quota = data.headers['x-ratelimit-remaining'];
                if (data.headers['x-ratelimit-limit'] !== undefined)
                    this._quotaMax = data.headers['x-ratelimit-limit'];
                if (data.headers['x-ratelimit-reset'] !== undefined)
                    this._reset = data.headers['x-ratelimit-reset'];
                //if data has been returned(aka not null) and there are no custom options, set cache
                if (this._cache && ((!options && data.data) || options?.cache))
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
                this._errorHandler(er);
            }
            if (!this._errorHandler(data))
                return;
            if (data) {
                if (data.headers['x-ratelimit-remaining'] !== undefined)
                    this._quota = data.headers['x-ratelimit-remaining'];
                if (data.headers['x-ratelimit-limit'] !== undefined)
                    this._quotaMax = data.headers['x-ratelimit-limit'];
                if (data.headers['x-ratelimit-reset'] !== undefined)
                    this._reset = data.headers['x-ratelimit-reset'];
                //setting cache on normal request
                if (this._cache && ((!options && data.data) || options?.cache)) {
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
                this._errorHandler(er);
            }
            if (!this._errorHandler(data))
                return;
            if (data) {
                if (data.headers['x-ratelimit-remaining'] !== undefined)
                    this._quota = data.headers['x-ratelimit-remaining'];
                if (data.headers['x-ratelimit-limit'] !== undefined)
                    this._quotaMax = data.headers['x-ratelimit-limit'];
                if (data.headers['x-ratelimit-reset'] !== undefined)
                    this._reset = data.headers['x-ratelimit-reset'];
                //if data has been returned(aka not null) and there are no custom options, set cache
                if (this._cache && ((!options && data.data) || options?.cache))
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
                this._errorHandler(er);
            }
            if (!this._errorHandler(data))
                return;
            if (data) {
                if (data.headers['x-ratelimit-remaining'] !== undefined)
                    this._quota = data.headers['x-ratelimit-remaining'];
                if (data.headers['x-ratelimit-limit'] !== undefined)
                    this._quotaMax = data.headers['x-ratelimit-limit'];
                if (data.headers['x-ratelimit-reset'] !== undefined)
                    this._reset = data.headers['x-ratelimit-reset'];
                //setting cache on normal request
                if (this._cache && ((!options && data.data) || options?.cache)) {
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
                this._errorHandler(er);
            }
            if (!this._errorHandler(data))
                return;
            if (data) {
                if (data.headers['x-ratelimit-remaining'] !== undefined)
                    this._quota = data.headers['x-ratelimit-remaining'];
                if (data.headers['x-ratelimit-limit'] !== undefined)
                    this._quotaMax = data.headers['x-ratelimit-limit'];
                if (data.headers['x-ratelimit-reset'] !== undefined)
                    this._reset = data.headers['x-ratelimit-reset'];
                //if data has been returned(aka not null) and there are no custom options, set cache
                if (this._cache && ((!options && data.data) || options?.cache))
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
                this._errorHandler(er);
            }
            if (!this._errorHandler(data))
                return;
            if (data) {
                if (data.headers['x-ratelimit-remaining'] !== undefined)
                    this._quota = data.headers['x-ratelimit-remaining'];
                if (data.headers['x-ratelimit-limit'] !== undefined)
                    this._quotaMax = data.headers['x-ratelimit-limit'];
                if (data.headers['x-ratelimit-reset'] !== undefined)
                    this._reset = data.headers['x-ratelimit-reset'];
                //setting cache on normal request
                if (this._cache && ((!options && data.data) || options?.cache)) {
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
exports.default = Teyvat;
