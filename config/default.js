/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

const fs = require('fs');
const path = require('path');

const config = {
  database: {
    filename: path.join(__dirname, 'db.sqlite3'),
  },
  // The Gateway's URL
  gateway: 'https://localhost:4443',
  // A JWT for authentication, TODO: support an OAuth v2 flow for acquiring
  // this
  jwt: null
};

let jwtPath =  path.join(__dirname, '../static/src/jwt.js');
if (fs.existsSync(jwtPath)) {
  config.jwt = require('../static/src/jwt.js');
}

module.exports = config;
