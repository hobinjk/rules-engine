const express = require('express');
const winston = require('winston');
// const triggers = require('./triggers');
// const actions = require('./actions');
const Engine = require('./Engine');
const Rule = require('./Rule');

const index = express.Router();

winston.cli();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

let engine = new Engine();
let testRule = Rule.fromDescription({
  trigger: {
    property: {
      name: 'on',
      type: 'boolean',
      href:
        '/things/tplight-801236A350B261121D731A04EE839B601800478A/properties/on'
    },
    type: 'BooleanTrigger',
    onValue: true
  },
  action: {
    property: {
      name: 'on',
      type: 'boolean',
      href: '/things/philips-hue-001788fffe4f2113-1/properties/on'
    },
    type: 'PulseAction',
    value: true
  }
});
engine.addRule(testRule);

setInterval(function() {
  engine.update();
}, 1000);

class APIError extends Error {
  constructor(message) {
    super(message);
  }

  toString() {
    return JSON.stringify({error: true, message: this.message});
  }
}

index.use('/', express.static('static'));

index.get('/rules', function(req, res) {
  res.send(JSON.stringify(engine.rules));
});

index.post('/rules', function(req, res) {
  if (!req.body.trigger) {
    res.status(400).send(new APIError('No trigger provided'));
  }
  if (!req.body.action) {
    res.status(400).send(new APIError('No action provided'));
  }

  let rule = null;
  try {
    rule = Rule.fromDescription(req.body);
  } catch(e) {
    res.status(400).send(new APIError('Invalid rule:', e.message));
  }

  if (rule) {
    engine.addRule(rule);
  }
});

// index.use('/triggers', triggers.router);
// index.use('/actions', actions.router);

module.exports = index;
