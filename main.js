/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const index = require('./index.js');

const app = express();
const port = 8081;

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json());

app.use('/', index);

const server = http.createServer(app);

server.listen(port, function() {
  console.log('Listening on http://localhost:' + server.address().port);
});

module.exports = server;
