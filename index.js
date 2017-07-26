/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

const express = require('express');
const winston = require('winston');
const Engine = require('./Engine');
const Rule = require('./Rule');
const APIError = require('./APIError');

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


index.use('/', express.static('static'));

/**
 * Express middleware for extracting rules from the bodies of requests
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 */
function parseRuleFromBody(req, res, next) {
  if (!req.body.trigger) {
    res.status(400).send(new APIError('No trigger provided').toString());
    return;
  }
  if (!req.body.action) {
    res.status(400).send(new APIError('No action provided').toString());
    return;
  }

  let rule = null;
  try {
    rule = Rule.fromDescription(req.body);
  } catch(e) {
    res.status(400).send(new APIError('Invalid rule:', e.message).toString());
    return;
  }
  req.rule = rule;
  next();
}

index.get('/rules', function(req, res) {
  res.send(JSON.stringify(engine.getRules()));
});

index.post('/rules', parseRuleFromBody, function(req, res) {
  let ruleId = engine.addRule(req.rule);

  if (!ruleId) {
    res.status(500).send(new APIError('Engine failed to add rule').toString());
  }

  res.send({id: ruleId});
});

index.put('/rules/:id', parseRuleFromBody, function(req, res) {
  try {
    engine.updateRule(req.params.id, req.rule);
    res.send({});
  } catch(e) {
    res.status(500).send(new APIError('Engine failed to update rule: ' +
      e.message));
  }
});

index.delete('/rules/:id', function(req, res) {
  try {
    engine.deleteRule(req.params.id)
    res.send({});
  } catch(e) {
    res.status(500).send(new APIError('Engine failed to delete rule: ' +
      e.message));
  }
});

module.exports = index;
