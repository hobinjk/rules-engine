/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

/**
 * Model of a Rule loaded from the Rules Engine
 * @constructor
 * @param {Gateway} gateway - The remote gateway to which to talk
 * @param {RuleDescription?} desc - Description of the rule to load
 * @param {Function?} onUpdate - Listener for when update is called
 */
function Rule(gateway, desc, onUpdate) {
  this.gateway = gateway;
  this.onUpdate = onUpdate;

  if (desc) {
    this.id = desc.id;
    if (desc.name) {
      this.name = desc.name;
    } else {
      this.name = 'Rule Name';
    }
    this.trigger = desc.trigger;
    this.action = desc.action;
  }
}

/**
 * Validate and save the rule
 * @return {Promise}
 */
Rule.prototype.update = function() {
  if (this.onUpdate) {
    this.onUpdate();
  }
  let desc = this.toDescription();
  if (!desc) {
    return Promise.reject('invalid description');
  }

  let fetchOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(desc)
  };
  let request = null;
  if (typeof(this.id) !== 'undefined') {
    request = fetch('rules/' + this.id, fetchOptions);
  } else {
    fetchOptions.method = 'POST';
    request = fetch('rules/', fetchOptions).then(res => {
      return res.json();
    }).then(rule => {
      this.id = rule.id;
    });
  }
  return request;
};

/**
 * Convert this rule into a serialized description
 * @return {RuleDescription?} description or null if not a valid rule
 */
Rule.prototype.toDescription = function() {
  let trigger = {
    property: this.triggerProperty.selectedOption
  };
  if (trigger.property.placeholder) {
    return null;
  }
  if (trigger.property.type === 'boolean') {
    trigger.type = 'BooleanTrigger';
    trigger.onValue = this.triggerValue.selectedOption.value;
    if (typeof trigger.onValue === 'undefined' ||
        trigger.onValue.placeholder) {
      return null;
    }
  } else if (trigger.property.type === 'number') {
    trigger.type = 'LevelTrigger';
    trigger.levelType = this.triggerType.selectedOption.value;
    let level = parseFloat(this.triggerValueInput.value);
    if (isNaN(level)) {
      return null;
    }
    trigger.level = level;
  } else {
    return null;
  }

  let action = {
    property: this.actionProperty.selectedOption
  };

  if (action.property.placeholder) {
    return null;
  }

  action.type = this.actionType.selectedOption.value;
  if (action.property.type === 'boolean') {
    action.value = this.actionValue.selectedOption.value;
    if (typeof action.value === 'undefined' || action.value.placeholder) {
      return null;
    }
  } else if (action.property.type === 'number') {
    let value = parseFloat(this.actionValueInput.value);
    if (isNaN(value)) {
      return null;
    }
    action.value = value;
  } else {
    return null;
  }

  return {
    name: this.name,
    trigger: trigger,
    action: action
  };
};

// Helper function for selecting the thing corresponding to a property
const RuleUtils = {
  byProperty: function byProperty(property) {
    return function(option) {
      let optProp = option.properties[property.name];
      return optProp && (optProp.href === property.href);
    };
  }
};

/**
 * Convert the rule's trigger's description to a human-readable string
 * @return {String}
 */
Rule.prototype.toTriggerHumanDescription = function() {
  let triggerThing = this.gateway.things.filter(
    RuleUtils.byProperty(this.trigger.property)
  )[0];

  let triggerStr = `${triggerThing.name} ${this.trigger.property.name} is `;
  if (this.trigger.type === 'BooleanTrigger') {
    triggerStr += this.trigger.onValue;
  } else {
    if (this.trigger.levelType === 'LESS') {
      triggerStr += 'less than ';
    } else {
      triggerStr += 'greater than ';
    }
    triggerStr += this.trigger.level;
  }

  return triggerStr;
};

/**
 * Convert the rule's action's description to a human-readable string
 * @return {String}
 */
Rule.prototype.toActionHumanDescription = function() {
  let actionThing = this.gateway.things.filter(
    RuleUtils.byProperty(this.action.property)
  )[0];

  let actionStr = '';

  if (this.action.type === 'SET') {
    actionStr += 'set ';
  } else {
    actionStr += 'pulse ';
  }

  actionStr += `${actionThing.name} ${this.action.property.name} to `;
  actionStr += this.action.value;

  return actionStr;
};

/**
 * Convert the rule's description to a human-readable string
 * @return {String}
 */
Rule.prototype.toHumanDescription = function() {
  let triggerStr = '???';
  let actionStr = '???';

  if (this.trigger) {
    triggerStr = this.toTriggerHumanDescription();
  }
  if (this.action) {
    actionStr = this.toActionHumanDescription();
  }
  return 'If ' + triggerStr + ' then ' + actionStr;
};

/**
 * Set the trigger of the Rule, updating the server model if valid
 * @return {Promise}
 */
Rule.prototype.setTrigger = function(trigger) {
  this.trigger = trigger;
  return this.update();
};

/**
 * Set the action of the Rule, updating the server model if valid
 * @return {Promise}
 */
Rule.prototype.setAction = function(action) {
  this.action = action;
  return this.update();
};

