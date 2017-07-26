/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

const assert = require('assert');
const PropertyTrigger = require('./PropertyTrigger');

/**
 * A Trigger which activates when a boolean property is
 * equal to a given value, `onValue`
 */
class BooleanTrigger extends PropertyTrigger {
  constructor(desc) {
    super(desc);
    assert(this.property.type === 'boolean');
    assert(typeof(desc.onValue) === 'boolean');
    this.onValue = desc.onValue;
  }

  /**
   * @return {State}
   */
  getState() {
    return this.property.get().then(propValue => {
      if (propValue === this.onValue) {
        return {on: true, value: propValue};
      } else {
        return {on: false, value: propValue};
      }
    });
  }
}

module.exports = BooleanTrigger;
