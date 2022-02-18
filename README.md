# Genshin Impact API wrapper for JavaScript and Typescript

## This is an SDK node-js wrapper to aid connecting with [Teyvat-API](https://rest.teyvat.dev/docs), which is an API to fetch info about the game Genshin Impact, by Mihoyo

Official links: [[Npm]](https://www.npmjs.com/package/@teyvatdev/node-sdk) [[Github]](https://github.com/erwin1234777/teyvatdev-node-sdk) [[Website]](https://rest.teyvat.dev/docs) [[Support]](https://discord.gg/6QEExsN) [[API support]](https://discord.gg/Pb8aQqx7kr)

## Installation

### Using Npm

```npm
npm i @teyvatdev/node-sdk
```

### Why Teyvat-API?

 This is an actual API wrapper, unlike most npm packages that stores json databases containing character data, this fetches and caches it locally from the API real time, so if the values change, you would normally require the author of the package to manually update their database, which forces users to need to update their package. This leads to apps needed to be shutdown for upgrades and updates. Unlike those, we fetch this data dynamically and check periodically for changes in the API itself, so the only updates you'll need to do on this package are major API changes, not related to the data, which is handled internally.

## ``Index``

- [Token](#how-to-get-your-token)
- [Implementation Js](#in-node-js-javascript)
- [Implementation Ts](#in-node-js-typescript)
- [Constructor](#constructor-parameters)
- [Methods](#methods)
- [Internals](#internals)
- [Events](#events)

### In Node-js (JavaScript)

```ts
const Tey = require('@teyvatdev/node-sdk');

//Constructor
const tey = new Tey.default('Token Here');

//method getCharacter(), gets a character by name
tey.getCharacter('Amber').then((data) => {
  console.log(data);
  //Expected, Amber stats
});
```

### In Node-js (TypeScript)

```js
import { Teyvat } from '@teyvatdev/node-sdk';

//Constructor
const tey = new Teyvat('Token Here');

//method getCharacter(), gets a character by name
tey.getCharacter('Amber').then((data) => {
  console.log(data);
  //Expected, Amber stats
});
```

## Constructor parameters

| Parameter            | Type    | Optional | Description                                                                        |
| -------------------- | ------- | -------- | ---------------------------------------------------------------------------------- |
| `token`              | String  | No       | Teyvat API token, read [HERE](##-How-to-get-your-token) to generate one       |
| `options`            | Object  | Yes      | Object to be passed to the constructor                                             |
| `options.aggressive` | Boolean | Yes      | This will fetch and cache all endpoints into the client, RAM expensive, be careful. Default: false |
| `options.cache` | Boolean | Yes      | This will enable or disable caching internally. Default: true  |
| `options.silent` | Boolean | Yes      | This will make it so the library does not throw any logs or errors, be carefull, this can swallow important errors. Default: false |
# Methods options
Method options have been deprecated in favor of a more "begginer friendly" lib. The library is set to cache and return
all data by default, it'll search for cached first, and only fetch the missing entries. This was done to prevent accidental API
abuse. If you plan on using custom requests, i made the method `<Teyvat>.baseRequest()` public for you to use, and as of that, i assume you are good to go on your own. Intellisense will help you.


#### [] means optional parameter

| Method                   | Params          | Returns             | Working Example(copy paste)                                                            |
| ------------------------ | --------------- | ------------------- | -------------------------------------------------------------------------------------- |
| `getCharacter()`         | name | Object, null        | `let Amber = await tey.getCharacter('Amber');`                                         |
| `getCharacters()`        |       | Object[array], null | `let Characters = await tey.getCharacters();`                                          |
| `getWeapon()`            | ID   | Object, null        | `let FavoniuSword = await tey.getWeapon('10');`                                        |
| `getWeapons()`           |       | Object[array], null | `let Weapons = await tey.getWeapons();`                                                |
| `getRegion()`            | CUID | Object, null        | `let Mondstad = await tey.getRegion('ckifg54kg0000vf0iclar2lp6');`                     |
| `getRegions()`           |       | Object[array], null | `let Regions = await tey.getRegions();`                                                |
| `getRegion()`            | CUID | Object, null        | `let Anemo = await tey.getElement('ckifg2oxf0000n30i3k0e3s7m');`                       |
| `getRegions()`           |       | Object[array], null | `let Elements = await tey.getElements();`                                              |
| `getTalent()`            | CUID | Object, null        | `let Divine_Marksmanship = await tey.getTalent('ckiqng1u300210ns6clktnh3c');`          |
| `getTalents()`           |        | Object[array], null | `let Talents = await tey.getTalents();;`                                               |
| `getArtifacts()`  |  | Object[array], null        | `let Artifacts = await tey.getArtifacts();`       |
| `getArtifactSets()` |        | Object[array], null | `let ArtifactSets = await tey.getArtifactSets();`                            |
| `getCharacterProfile()`  | CUID | Object, null        | `let AmberProfile = await tey.getCharacterProfile('ckiffwvsx0000990i1z9retm4');`       |
| `getCharacterProfiles()` |      | Object[array], null | `let CharacterProfiles = await tey.getCharacterProfiles();`                            |
| `flushCache()`           | [options]       |                     | `tey.flushCache()`                                                                     |
| `cacheAll()`             |                 | boolean             | `tey.cacheAll()` Returns true if everything has been cached, false if something failed |

## How to get your token

The lib now includes a method for creating an account and getting a token. Here are some snippets.
You HAVE TO ACTIVATE IT in the email you provided

```js

const Tey = require('@teyvatdev/node-sdk');

const email = 'some_email@gmail.com';
const password = 'myfancypassword';
const username = 'myusername';

Tey.createAccount(email, username, password).then(res => {
  if (res) console.log('Success, now activate it on ur mail');
  else console.log('Something wrong happened!');
});
// AFTER YOU ACTIVATED IT, DONT RUN THE REST OR IT WILL ERROR
Tey.login(email, password).then(res => {
  if (!res) console.log('Failed to login! Did u make sure to active ur account in your email?');
  else console.log(res.token);
});

```


## Events

Observations: the event `ready` will be emitted AFTER the lib has cached all entries if you provided the `aggressive` flag in the constructor options

| Event                   | Emits          | Working Example(copy paste)                                                            |
| ------------------------ | --------------- |  -------------------------------------------------------------------------------------- |
| `ready`         | true , undefined  | `tey.on('ready', (ret) => { if(ret) console.log('Finished startup!'); })`                                         |
| `restRequest`         | Object[data]  | `tey.on('restRequest', (req) => { console.log('request sent ', req) })`                                         |
| `restError`         | Object[error]  | `tey.on('restError', (err) => { console.log('request returned an error ', err) })`                                         |
| `errorHandler`         | Object[data]  | `tey.on('errorHandler', (err) => { console.log('the handler handled an error ', err) })`                                         |

## ``Internals``

 The lib is shielded with 200 http request status checks, the cache and the returns will only be used when the API sends an OK status.
 The lib has an internal error checker to pass the request and throw the appropriate errors. (Due to the nature of objects, it is recommended to use Visual Studio Code with a .vscode config without ``--outputCapture`` flag, otherwise objects might cause spam in console as they contain the error message and a trace for debugging )

Some other note worthy mentions is a ready state that waits the library to request data to the api on its construction, a rate limiter, a queue system to prevent spam, a cache flush and a retry method.
