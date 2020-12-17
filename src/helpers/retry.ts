const retry = (delay: number): Promise<unknown> =>
  new Promise(resolve => {
    if (Math.sign(delay) === -1) delay = 900;
    setTimeout(resolve, Math.ceil(delay) * 1000);
  });

export default retry;
