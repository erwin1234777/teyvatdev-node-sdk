# Genshin Impact API wrapper for JavaScript and Typescript

## This is an SDK node-js wrapper to aid connecting with [Teyvat-API](https://github.com/teyvat-dev), which is an API to fetch info about the game Genshin Impact, by Mihoyo

Official links: [[Npm]](https://www.npmjs.com/package/@teyvatdev/node-sdk) [[Github]](https://github.com/erwin1234777/teyvatdev-node-sdk) [[Website]](https://teyvat.dev/) [[Support]](https://discord.gg/6QEExsN) [[API support]](https://discord.gg/Pb8aQqx7kr)

## Installation

### Using Npm

```npm
npm i @teyvatdev/node-sdk
```

### Why Teyvat-API?

 This is an actual API wrapper, unlike most npm packages that stores json databases containing character data, this fetches and caches it locally from the API real time, so if the values change, you would normally require the author of the package to manually update their database, which forces users to need to update their package. This leads to apps needed to be shutdown for upgrades and updates. Unlike those, we fetch this data dynamically and check periodically for changes in the API itself, so the only updates you'll need to do on this package are major API changes, not related to the data, which is handled internally. This library also provides a method to register and fetch your token internally, without the need of Postman or other https requests.

## ``Index``

- [Token](##-How-to-get-your-token)
- [Implementation Js](###-In-Node-js-(JavaScript))
- [Implementation Ts](###-In-Node-js-(TypeScript))
- [Manual Token Ts](##-``Node-js(JypeScript)``)
- [Manual Token Js](##-``Node-js(TypeScript)``)
- [Automated Token Fetch Ts](##-``TypeScript-Automatic-Script``)
- [Automated Token Fetch Js](##-``JavaScript-Automatic-Script``)
- [Constructor](##-Constructor-parameters)
- [Methods](##-Methods)
- [Internals](##-``Internals``)

### In Node-js (JavaScript)

```ts
const Tey = require('@teyvatdev/node-sdk');

//Constructor
const tey = new Tey.Teyvat('Token Here');

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

## Methods

### All methods allow for custom options Object, which are those

| Key       | Description                                                                                                                  |
| --------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `skip`    | Number, skips the index until that specified index. 5, for example, skips the first 5 entries and starts getting entries after that. |
| `take`    | Number, the amount of entries to be returned                                                                                         |
| `include` | Not used yet                                                                                                                 |
| `cache`   | Boolean, skips the custom check inside the library and forces the returned entries to be cached                                       |

#### [] means optional parameter

| Method                   | Params          | Returns             | Working Example(copy paste)                                                            |
| ------------------------ | --------------- | ------------------- | -------------------------------------------------------------------------------------- |
| `getCharacter()`         | name, [options] | Object, null        | `let Amber = await tey.getCharacter('Amber');`                                         |
| `getCharacters()`        | [options]       | Object[array], null | `let Characters = await tey.getCharacters();`                                          |
| `getWeapon()`            | ID, [options]   | Object, null        | `let FavoniuSword = await tey.getWeapon('10');`                                        |
| `getWeapons()`           | [options]       | Object[array], null | `let Weapons = await tey.getWeapons();`                                                |
| `getRegion()`            | CUID, [options] | Object, null        | `let Mondstad = await tey.getRegion('ckifg54kg0000vf0iclar2lp6');`                     |
| `getRegions()`           | [options]       | Object[array], null | `let Regions = await tey.getRegions();`                                                |
| `getRegion()`            | CUID, [options] | Object, null        | `let Anemo = await tey.getElement('ckifg2oxf0000n30i3k0e3s7m');`                       |
| `getRegions()`           | [options]       | Object[array], null | `let Elements = await tey.getElements();`                                              |
| `getTalent()`            | CUID, [options] | Object, null        | `let Divine_Marksmanship = await tey.getTalent('ckiqng1u300210ns6clktnh3c');`          |
| `getTalents()`           | [options]       | Object[array], null | `let Talents = await tey.getTalents();;`                                               |
| `getCharacterProfile()`  | CUID, [options] | Object, null        | `let AmberProfile = await tey.getCharacterProfile('ckiffwvsx0000990i1z9retm4');`       |
| `getCharacterProfiles()` | [options]       | Object[array], null | `let CharacterProfiles = await tey.getCharacterProfiles();`                            |
| `flushCache()`           | [options]       |                     | `tey.flushCache()`                                                                     |
| `cacheAll()`             |                 | boolean             | `tey.cacheAll()` Returns true if everything has been cached, false if something failed |

## ``Register Class``

| Method                   | Params          | Returns             | Working Example(copy paste)                                                            |
| ------------------------ | --------------- | ------------------- | -------------------------------------------------------------------------------------- |
| `registerUser()`         | email?, password? | string,null        | `register.registerUser();`  You do NOT need to pass in the email and password if you already put it in the constructor                                     |
| `getToken()`         | email?, password? | Token,null        | `register.getToken();`  You do NOT need to pass in the email and password if you already put it in the constructor. Returns a Teyvat Token                                     |

## How to get your token

 Make sure to verify your email before continuing, otherwise you will get an error. Do registerUser() first, verify email, then do getToken();
 It is recommended to keep your token safe and secure. Tips: Do not hardcode your token, add it to an .ENV file or a config.json;

## ``Node-js(TypeScript)``

 ```ts
 import { Register } from 'teyvatdev-node-sdk'

 const register = new Register('YourEmailHere','YourPasswordHere');
 register.registerUser();

 //Go to your email and activate it before continuining!!!!
 register.getToken().then((token) => console.log(token));
 ```

## ``Node-js(JavaScript)``

 ```js
 const Register = require('teyvatdev-node-sdk').Register;

 const register = new Register('YourEmailHere','YourPasswordHere');
 register.registerUser();

 //Go to your email and activate it before continuining!!!!
 register.getToken().then((token) => console.log(token));
 ```

 After you've acquired your token, you may use it on the Teyvat constructor, which is the one used for the API wrapper

 Thats it, you finished!

 If you wish an automated script to run it and get your token, i've made this so you can paste it on your script to run it, it will wait 5 minutes until your email gets verified, then run the rest of the code

## DO NOT SHARE YOUR TOKEN, THESE SCRIPTS WILL SHOW YOUR TOKEN IN YOUR TERMINAL

## ``TypeScript Automatic Script``

TOKEN IN CONSOLE

Run with ``ts-node <filename>.ts``

Run [ ``npm i ts-node`` ] if ts-node is not installed already

 ```ts
 import { Register } from 'teyvatdev-node-sdk';

 const register = new Register('YourEmailHere','YourPasswordHere');
 register.registerUser().then(user: string | null => {
  if(!user) return console.log('There was an error registering, please retry');
  console.log('Please go verify at the email provided! The script will continue in 5 minutes, verify it before then!')
  setTimeout(() => {
  //This is delay for you to go verify your email, you got 5 minutes
  register.getToken().then(token: string | null => {
   if(token) console.log(token);
   else console.log('An error occurred, token returned null');
   });
 },300000)
 })

 ```

## ``JavaScript Automatic Script``

TOKEN IN CONSOLE

Run with ``node <filename>.js``

 ```js
 const Register = require('teyvatdev-node-sdk').Register;
 const register = new Register('YourEmailHere','YourPasswordHere');
 register.registerUser().then(user => {
  if(!user) return console.log('There was an error registering, please retry');
  console.log('Please go verify at the email provided! The script will continue in 5 minutes, verify it before then!')
  setTimeout(() => {
  //This is delay for you to go verify your email, you got 5 minutes
  register.getToken().then(token => {
   if(token) console.log(token);
   else console.log('An error occurred, token returned null');
   });
 },300000)
 })

 ```

## ``Internals``

 The lib is shielded with 200 http request status checks, the cache and the returns will only be used when the API sends an OK status.
 The lib has an internal error checker to pass the request and throw the appropriate errors. (Due to the nature of objects, it is recommended to use Visual Studio Code with a .vscode config without ``--outputCapture`` flag, otherwise objects might cause spam in console as they contain the error message and a trace for debugging )

Some other note worthy mentions is a ready state that waits the library to request data to the api on its construction, a rate limiter, a queue system to prevent spam, another exported class constructor to help fetching the api token, a cache flush and a retry method.
