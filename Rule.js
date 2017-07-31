/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

const actions = require('./actions');
const triggers = require('./triggers');
const Events = require('./Events');

class Rule {
  constructor(trigger, action) {
    this.trigger = trigger;
    this.action = action;

    this.onTriggerStateChanged = this.onTriggerStateChanged.bind(this);
    this.trigger.on(Events.STATE_CHANGED, this.onTriggerStateChanged);
  }

  onTriggerStateChanged(state) {
    this.action.setState(state);
  }

  toDescription() {
    return this;
  }
}

Rule.fromDescription = function(desc) {
  const trigger = triggers.fromDescription(desc.trigger);
  const action = actions.fromDescription(desc.action);
  let rule = new Rule(trigger, action);
  if (desc.hasOwnProperty('id')) {
    rule.id = desc.id;
  }
  return rule;
};

module.exports = Rule;
