/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

/* global jwt */

/**
 * A remote Gateway
 */
function Gateway() {
  this.things = null;
}

/**
 * Read the list of Things managed by the gateway
 * @return {Promise<Array<ThingDescription>>}
 */
Gateway.prototype.readThings = function() {
  return fetch('/things', {
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + jwt
    }
  }).then(res => {
    return res.json();
  }).then(things => {
    this.things = things;
    return things;
  });
};
