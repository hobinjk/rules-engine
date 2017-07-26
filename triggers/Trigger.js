/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

/**
 * The trigger component of a Rule which monitors some state and passes on
 * whether to be active to the Rule's action
 */
class Trigger {
  constructor() {
    this.type = this.constructor.name;
  }

  getState() {
    throw new Error('Unimplemented');
  }
}

module.exports = Trigger;
