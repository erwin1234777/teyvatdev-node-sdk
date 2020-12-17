import type { Teyvat } from '..';

function cacheAll(this: Teyvat): Promise<boolean> {
  //eslint-disable-next-line no-async-promise-executor
  return new Promise(async res => {
    if (this._quota < 6) return res(false);

    await this.getCharacters({ take: 300, cache: true });
    await this.getWeapons({ take: 300, cache: true });
    await this.getRegions({ take: 300, cache: true });
    await this.getElements({ take: 300, cache: true });
    await this.getTalents({ take: 300, cache: true });
    await this.getCharacterProfiles({ take: 300, cache: true });

    return res(true);
  });
}

export default cacheAll;
