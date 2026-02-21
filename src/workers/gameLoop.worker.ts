// minimal game loop worker
// messages received: { action: 'start' | 'stop' }
// messages posted: { type: 'gameTick' } or { type: 'eventTick' }

let gameTimer: number | undefined;
let eventTimer: number | undefined;

self.onmessage = (e) => {
  const data = e.data;
  if (data.action === 'start') {
    if (gameTimer === undefined) {
      // NodeJS setInterval returns a Timeout object; cast to number for our typings
      gameTimer = setInterval(() => {
        self.postMessage({ type: 'gameTick' });
      }, 1000) as unknown as number;
    }
    if (eventTimer === undefined) {
      eventTimer = setInterval(() => {
        self.postMessage({ type: 'eventTick' });
      }, 5000) as unknown as number;
    }
  } else if (data.action === 'stop') {
    if (gameTimer !== undefined) {
      clearInterval(gameTimer);
      gameTimer = undefined;
    }
    if (eventTimer !== undefined) {
      clearInterval(eventTimer);
      eventTimer = undefined;
    }
  }
};
