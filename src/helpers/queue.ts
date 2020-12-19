import { queue } from 'async';

export default queue(async (fn: Function) => fn(), 1);
