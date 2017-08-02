/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

const path = require('path');

module.exports = {
  database: {
    filename: path.join(__dirname, '../db.sqlite3'),
  },
  // The Gateway's URL
  gateway: 'https://localhost:4443'
};
