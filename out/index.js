"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAccount = exports.login = void 0;
const async = __importStar(require("async"));
const axios_1 = __importDefault(require("axios"));
const events_1 = require("events");
const axios = axios_1.default.create({
    timeout: 60000,
    //httpsAgent: agent,
});
async function login(email, password) {
    if (!email)
        throw new Error('No email provided, or empty string!');
    if (!password)
        throw new Error('No password provided, or empty string!');
    if (typeof email !== 'string')
        throw new Error('Type of email is not string!');
    if (typeof password !== 'string')
        throw new Error('Type of password is not string!');
    try {
        let res = await axios.post('https://rest.teyvat.dev/auth/login', {
            email,
            password,
        }, {});
        if (res?.status === 200) {
            return res.data;
        }
        else {
            console.log(res?.data);
            return false;
        }
    }
    catch (e) {
        if (e && e.data)
            console.log(e.data);
        return false;
    }
}
exports.login = login;
async function createAccount(email, username, password) {
    if (!email)
        throw new Error('No email provided, or empty string!');
    if (!username)
        throw new Error('No username provided, or empty string!');
    if (!password)
        throw new Error('No password provided, or empty string!');
    if (typeof email !== 'string')
        throw new Error('Type of email is not string!');
    if (typeof username !== 'string')
        throw new Error('Type of username is not string!');
    if (typeof password !== 'string')
        throw new Error('Type of password is not string!');
    try {
        let res = await axios.post('https://rest.teyvat.dev/auth/signup', {
            email,
            username,
            password,
        }, {});
        if (res?.status === 200) {
            console.log('Successfully registered on the API. Go and activate your account on the email provided. Then use .login() to get your token, make sure NOT to show your token to anyone');
            return true;
        }
        else {
            console.log(res?.data);
            return false;
        }
    }
    catch (e) {
        if (e && e.data)
            console.log(e.data);
        return false;
    }
}
exports.createAccount = createAccount;
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
class Teyvat extends events_1.EventEmitter {
    //Base URL
    base;
    //TEYVAT token
    _token;
    //all methods below this point
    //each cache has an index of null, which is assigned to the default caller for the methods that dont require parameters. AKA getCharacters(), without parameter options.
    //TODO Add lifetime for the cached requests so they can be refreshed, in case there are any updates in the API's database, a setInterval every couple hours would be preferred over checking on every request has reached its lifetime
    _charactersCache;
    _artifactsCache;
    _artifactSetsCache;
    _weaponsCache;
    _regionsCache;
    _elementsCache;
    _talentsCache;
    _charactersProfilesCache;
    getCharacter;
    getCharacters;
    getWeapon;
    getWeapons;
    getRegion;
    getRegions;
    getElement;
    getElements;
    getTalent;
    getTalents;
    getCharacterProfile;
    getCharacterProfiles;
    getArtifacts;
    getArtifactSets;
    flushCache;
    baseRequest;
    setSkips;
    cacheAll;
    //Checks for errors, returns true on an error'ed request, returns false on a normalised 200 request
    _errorHandler;
    //a retry function to delay
    _retry;
    createAccount;
    login;
    //when was last request made
    _lastRequest;
    //current quota left
    _quota;
    //maximum quota
    _quotaMax;
    //the amount to be waited for the quota to reset
    _gracePeriod;
    //the reset timestamp IN SECONDS of when quota resets
    _reset;
    _silent;
    //When client is ready to be used by the user
    _ready;
    //When the client has successfully fetched the initial rates from the API
    _cache;
    _hasRates;
    _queue;
    constructor(token, options = {}) {
        super();
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
        this._artifactsCache = new Map();
        this._artifactSetsCache = new Map();
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
        this.baseRequest = async (param) => {
            let data = undefined;
            //checking if skipCacheCheck is true
            if (!param.skipCacheCheck && param.name)
                if (param.cache.has(param.name))
                    return param.cache.get(param.name);
            //checking for quota, if its lower than 4, wait until next reset
            if (this._quota < 4 && this._hasRates)
                await this._retry(Math.ceil(this._reset) - Math.ceil(Date.now() / 1000));
            // formatting body/params / accounting for stupidity
            if (param.params?.take &&
                (param.params.take > 100 || param.params.take <= 0))
                param.params.take = 100;
            if (param.body?.take && (param.body.take > 100 || param.body.take <= 0))
                param.body.take = 100;
            try {
                this.emit('restRequest', { data: param });
                data = await this._queue.push(async () => {
                    return await axios
                        .post(`${this.base}${param.endpoint}`, {
                        ...param.body,
                    }, {
                        headers: {
                            Authorization: 'Bearer ' + this._token,
                        },
                        params: {
                            ...param.params,
                            name: param.name,
                        },
                    })
                        .catch((e) => {
                        this.emit('restError', { error: e });
                        return e;
                    });
                });
                this.emit('restResponse', { data });
            }
            catch (er) {
                this.emit('restResponse', { data });
                //@ts-expect-error
                this._errorHandler(er);
            }
            if (this._errorHandler(data))
                return;
            if (data && data.status === 200) {
                this._hasRates = true;
                if (data.headers['x-ratelimit-remaining'] !== undefined)
                    this._quota = data.headers['x-ratelimit-remaining'];
                if (data.headers['x-ratelimit-limit'] !== undefined)
                    this._quotaMax = data.headers['x-ratelimit-limit'];
                if (data.headers['x-ratelimit-reset'] !== undefined)
                    this._reset = data.headers['x-ratelimit-reset'];
                //if data has been returned(aka not null) and there are no custom options, set cache
                if (!param.dontCache && data.data) {
                    param.cache.set(param.name ? param.name : null, data.data);
                    if (data.data.length)
                        for (let d of data.data)
                            if (d.name || d.id)
                                param.cache.set(d.name ?? d.id, d);
                }
            }
            return data?.data;
        };
        this.setSkips = async (fn, payload) => {
            let _payload = payload ?? { body: {}, params: {} };
            if (!_payload.body?.take)
                _payload.body.take = 100;
            let res = await new Promise(async (r, rej) => {
                r(await fn(_payload));
            });
            // console.log({ res, _payload });
            if (res?.length === (_payload?.body.take ?? 100)) {
                _payload.body.skip = (_payload.body.skip ?? 0) + res.length;
                res = res.concat(await this.setSkips(fn.bind(this), _payload));
            }
            return res;
        };
        this.cacheAll = async () => {
            return new Promise(async (res) => {
                if (this._quota < 6)
                    res(false);
                else {
                    await this.setSkips(this.baseRequest.bind(this), {
                        endpoint: 'characters',
                        skipCacheCheck: true,
                        cache: this._charactersCache,
                        body: { take: 100, include: { talents: true, ascensions: true } },
                    });
                    await this.setSkips(this.baseRequest.bind(this), {
                        endpoint: 'weapons',
                        skipCacheCheck: true,
                        cache: this._weaponsCache,
                        body: { take: 100, include: { weaponAscensions: true } },
                    });
                    await this.setSkips(this.baseRequest.bind(this), {
                        endpoint: 'regions',
                        skipCacheCheck: true,
                        cache: this._regionsCache,
                        body: { take: 100 },
                    });
                    await this.setSkips(this.baseRequest.bind(this), {
                        endpoint: 'elements',
                        skipCacheCheck: true,
                        cache: this._elementsCache,
                        body: { take: 100 },
                    });
                    await this.setSkips(this.baseRequest.bind(this), {
                        endpoint: 'talents',
                        skipCacheCheck: true,
                        cache: this._talentsCache,
                        body: { take: 100 },
                    });
                    await this.setSkips(this.baseRequest.bind(this), {
                        endpoint: 'characterProfiles',
                        skipCacheCheck: true,
                        cache: this._charactersProfilesCache,
                        body: { take: 100 },
                    });
                    await this.setSkips(this.baseRequest.bind(this), {
                        endpoint: 'artifacts',
                        skipCacheCheck: true,
                        cache: this._artifactsCache,
                        body: { take: 100 },
                    });
                    await this.setSkips(this.baseRequest.bind(this), {
                        endpoint: 'artifactSets',
                        skipCacheCheck: true,
                        cache: this._artifactSetsCache,
                        body: { take: 100, include: { artifacts: true } },
                    });
                    res(true);
                }
            });
        };
        this._ready = (async () => {
            //dummy request
            let fetchRates = await axios
                .get(this.base + 'character', {
                headers: {
                    Authorization: 'Bearer ' + this._token,
                },
                params: {
                    name: 'Amber',
                },
            })
                .catch((err) => {
                console.log(err);
                return null;
            });
            if (fetchRates) {
                if (fetchRates.headers['x-ratelimit-remaining'] !== undefined)
                    this._quota = fetchRates.headers['x-ratelimit-remaining'];
                if (fetchRates.headers['x-ratelimit-limit'] !== undefined)
                    this._quotaMax = fetchRates.headers['x-ratelimit-limit'];
                if (fetchRates.headers['x-ratelimit-reset'] !== undefined)
                    this._reset = fetchRates.headers['x-ratelimit-reset'];
                if (options?.aggressive)
                    await this.cacheAll();
                this.emit('ready', true);
            }
        })();
        this._retry = async function _retry(delay) {
            return new Promise((resolve) => {
                if (Math.sign(delay) === -1)
                    delay = 900;
                setTimeout(resolve, Math.ceil(delay) * 1000);
            });
        };
        this._errorHandler = (data) => {
            if (!data)
                return false;
            if (this._silent)
                return false; //this is as good as swallowing errors, though the user set the lib in silent mode, need to add WARN/INFO/ERROR levels
            if (data?.status === 200)
                return false;
            this.emit('errorHandler', { data });
            return true;
        };
        this.getCharacter = async function getCharacter(name) {
            let data = await this.baseRequest({
                endpoint: 'character',
                name,
                skipCacheCheck: false,
                cache: this._charactersCache,
            });
            if (data)
                return data;
            return undefined;
        };
        this.getCharacters = async function getCharacters() {
            let data = await this.setSkips(this.baseRequest.bind(this), {
                endpoint: 'characters',
                skipCacheCheck: false,
                cache: this._charactersCache,
                body: { take: 100, include: { talents: true, ascensions: true } },
            });
            if (data && data.length)
                return data;
            return undefined;
        };
        this.getArtifacts = async function getArtifacts() {
            let data = await this.setSkips(this.baseRequest.bind(this), {
                endpoint: 'artifacts',
                skipCacheCheck: false,
                cache: this._artifactsCache,
                body: { take: 100 },
            });
            if (data && data.length)
                return data;
            return undefined;
        };
        this.getArtifactSets = async function getArtifacts() {
            let data = await this.setSkips(this.baseRequest.bind(this), {
                endpoint: 'artifacts',
                skipCacheCheck: false,
                cache: this._artifactSetsCache,
                body: { take: 100 },
            });
            if (data && data.length)
                return data;
            return undefined;
        };
        this.getWeapon = async function getWeapon(id) {
            let data = await this.baseRequest({
                endpoint: 'weapon',
                skipCacheCheck: false,
                params: { id },
                cache: this._weaponsCache,
            });
            if (data)
                return data;
            return undefined;
        };
        this.getWeapons = async function getWeapons() {
            let data = await this.setSkips(this.baseRequest.bind(this), {
                endpoint: 'weapons',
                skipCacheCheck: false,
                cache: this._weaponsCache,
                body: { take: 100, include: { weaponAscensions: true } },
            });
            if (data && data.length)
                return data;
            return undefined;
        };
        this.getRegion = async function getRegion(id) {
            let data = await this.baseRequest({
                endpoint: 'region',
                params: { id },
                skipCacheCheck: false,
                cache: this._regionsCache,
            });
            if (data)
                return data;
            return undefined;
        };
        this.getRegions = async function getRegions() {
            let data = await this.setSkips(this.baseRequest.bind(this), {
                endpoint: 'regions',
                skipCacheCheck: false,
                cache: this._regionsCache,
                body: { take: 100 },
            });
            if (data && data.length)
                return data;
            return undefined;
        };
        this.getElement = async function getElement(id) {
            let data = await this.baseRequest({
                endpoint: 'element',
                params: { id },
                skipCacheCheck: false,
                cache: this._elementsCache,
            });
            if (data)
                return data;
            return undefined;
        };
        this.getElements = async function getElements() {
            let data = await this.setSkips(this.baseRequest.bind(this), {
                endpoint: 'elements',
                skipCacheCheck: false,
                cache: this._elementsCache,
                body: { take: 100 },
            });
            if (data && data.length)
                return data;
            return undefined;
        };
        this.getTalent = async function getTalent(id) {
            let data = await this.baseRequest({
                endpoint: 'talent',
                params: { id },
                skipCacheCheck: false,
                cache: this._talentsCache,
            });
            if (data)
                return data;
            return undefined;
        };
        this.getTalents = async function getTalents() {
            let data = await this.setSkips(this.baseRequest.bind(this), {
                endpoint: 'talents',
                skipCacheCheck: false,
                cache: this._talentsCache,
                body: { take: 100 },
            });
            if (data && data.length)
                return data;
            return undefined;
        };
        this.getCharacterProfile = async function getCharacterProfile(id) {
            let data = await this.baseRequest({
                endpoint: 'characterProfile',
                params: { id },
                skipCacheCheck: false,
                cache: this._charactersProfilesCache,
            });
            if (data)
                return data;
            return undefined;
        };
        this.getCharacterProfiles = async function getCharacterProfiles() {
            let data = await this.setSkips(this.baseRequest.bind(this), {
                endpoint: 'characterProfiles',
                skipCacheCheck: false,
                cache: this._charactersProfilesCache,
                body: { take: 100 },
            });
            if (data && data.length)
                return data;
            return undefined;
        };
    }
}
exports.default = Teyvat;
