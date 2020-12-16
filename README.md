## This is an SDK node-js wrapper to aid connecting with [Teyvat-API](https://github.com/teyvat-dev);

Official links: [[Npm]](https://www.npmjs.com/package/@teyvatdev/node-sdk) [[Github]](https://github.com/erwin1234777/teyvatdev-node-sdk) [[Website]](https://teyvat.dev/) [[Support]](https://discord.gg/6QEExsN) [[API support]](https://discord.gg/Pb8aQqx7kr)

## Installation

#### Using Npm:
```
$ npm i @teyvatdev/node-sdk
```

#### In Node-js (TypeScript)

```js
import { Teyvat } from '@teyvatdev/node-sdk';

//Constructor
const tey = new Teyvat('Token Here');

//method getCharacter(), gets a character by name
tey.getCharacter('Amber').then((data) => {
console.log(data);
 //Expected, Amber stats
})
```

## Constrcutor parameters

| Parameter | Type | Optional | Description |
| --- | --- | --- | --- |
| ``token`` | String | No | Teyvat API token, read [HERE]((https://discord.gg/Pb8aQqx7kr) to generate one |
| ``options`` | Object | Yes | Object to be passed to the constructor |
| ``options.aggressive`` | Boolean | Yes | This will fetch and cache all endpoints into the client, RAM expensive, be careful |


## Methods
### All methods allow for custom options Object, which are those:

| Key | Description |
| --- | --- |
| ``skip`` | Skips the index until that specified index. 5, for example, skips the first 5 entries and starts getting entries after that. |
| ``take`` | The amount of entries to be returned |
| ``include`` | Not used yet |
| ``cache`` | Skips the custom check inside the library and forces the returned entries to be cached |

#### [] means optional parameter
| Method | Params | Returns | Working Example(copy paste) |
| --- | --- | --- | --- |
| ``getCharacter()`` | name, [options] | Object, null | ``` let Amber = await tey.getCharacter('Amber'); ``` |
| ``getCharacters()`` | [options] | Object[array], null | ``` let Characters = await tey.getCharacters(); ``` |
| ``getWeapon()`` | ID, [options] | Object, null | ```let FavoniuSword = await tey.getWeapon('10');``` |
| ``getWeapons()`` | [options] | Object[array], null | ```let Weapons = await tey.getWeapons();``` |
| ``getRegion()`` | CUID, [options] | Object, null | ```let Mondstad = await tey.getRegion('ckifg54kg0000vf0iclar2lp6');``` |
| ``getRegions()`` | [options] | Object[array], null | ```let Regions = await tey.getRegions();``` |
| ``getRegion()`` | CUID, [options] | Object, null | ```let Anemo = await tey.getElement('ckifg2oxf0000n30i3k0e3s7m');``` |
| ``getRegions()`` | [options] | Object[array], null | ```let Elements = await tey.getElements();``` |
| ``getTalent()`` | CUID, [options] | Object, null | ```let Divine_Marksmanship = await tey.getTalent('ckiqng1u300210ns6clktnh3c');``` |
| ``getTalents()`` | [options] | Object[array], null | ```let Talents = await tey.getTalents();;``` |
| ``getCharacterProfile()`` | CUID, [options] | Object, null | ```let AmberProfile = await tey.getCharacterProfile('ckiffwvsx0000990i1z9retm4');``` |
| ``getCharacterProfiles()`` | [options] | Object[array], null | ```let CharacterProfiles = await tey.getCharacterProfiles();``` |
| ``flushCache()`` | [options] |  | ```tey.flushCache()``` |
| ``cacheAll()`` |  | boolean | ```tey.cacheAll()``` Returns true if everything has been cache, false if something failed |



