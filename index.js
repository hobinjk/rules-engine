const express = require('express');
const triggers = require('./triggers');
const actions = require('./actions');

const index = express.Router();


let rules = [];

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
  res.send(JSON.stringify(rules));
});

index.post('/rules', function(req, res) {
  if (!req.body.trigger) {
    response.status(400).send(new APIError('No trigger provided'));
  }
  if (!req.body.action) {
    response.status(400).send(new APIError('No action provided'));
  }

  try {
    rule = Rule.fromDescription(req.body);
  } catch(e) {
    response.status(400).send(new APIError('Invalid rule:', e.message));
  }

});

// index.use('/triggers', triggers.router);
// index.use('/actions', actions.router);

module.exports = index;
