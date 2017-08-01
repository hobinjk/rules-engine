const EventEmitter = require('events').EventEmitter;

const ws = jest.genMockFromModule('ws');

// TODO test websocket usage

class WebSocket extends EventEmitter {
  constructor(url) {
    super();
    this.url = url;
    this.readyState = ws.OPEN;
  }

  close() {
  }
}

module.exports = WebSocket;
