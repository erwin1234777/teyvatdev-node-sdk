import type Teyvat from '..';

function errorHandler(this: Teyvat, err: Error) {
  if (this._silent) return false; //this is as good as swallowing errors, though the user set the lib in silent mode, need to add WARN/INFO/ERROR levels

  console.error({ error: err });

  return true;
}

export default errorHandler;
