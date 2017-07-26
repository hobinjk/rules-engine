/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

module.exports = {
  // The Gateway's URL
  gateway: 'https://localhost:4443',
  // A JWT for authentication, TODO: support an OAuth v2 flow for acquiring
  // this
  jwt: require('../static/src/jwt.js')
};
