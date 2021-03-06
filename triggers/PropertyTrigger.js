/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

const Trigger = require('./Trigger');
const Property = require('../Property');

/**
 * An abstract class for triggers whose input is a single property
 */
class PropertyTrigger extends Trigger {
  constructor(desc) {
    super();
    this.property = new Property(desc.property);
  }
}

module.exports = PropertyTrigger;
