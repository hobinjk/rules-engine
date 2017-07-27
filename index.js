/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

const express = require('express');
const PromiseRouter = require('express-promise-router');
const winston = require('winston');
const path = require('path');

const Engine = require('./Engine');
const Rule = require('./Rule');
const APIError = require('./APIError');

const index = PromiseRouter();

winston.cli();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

let engine = new Engine();

setInterval(function() {
  engine.update();
}, 1000);

winston.info('path', path.join(__dirname, 'static'));
index.use('/', express.static(path.join(__dirname, 'static')));

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

index.get('/rules', async function(req, res) {
  res.send(await engine.getRules());
});

index.post('/rules', parseRuleFromBody, async function(req, res) {
  let ruleId = await engine.addRule(req.rule);
  res.send({id: ruleId});
});

index.put('/rules/:id', parseRuleFromBody, async function(req, res) {
  try {
    await engine.updateRule(parseInt(req.params.id), req.rule);
    res.send({});
  } catch(e) {
    res.status(404).send(new APIError('Engine failed to update rule: ' +
      e.message));
  }
});

index.delete('/rules/:id', async function(req, res) {
  try {
    await engine.deleteRule(req.params.id)
    res.send({});
  } catch(e) {
    res.status(404).send(new APIError('Engine failed to delete rule: ' +
      e.message));
  }
});

module.exports = index;
