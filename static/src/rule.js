/* global Selector */

let ruleTemplate = document.getElementById('rule-template');

function Rule(elt, gateway, desc) {
  this.elt = elt;
  this.gateway = gateway;

  this.elt.innerHTML = ruleTemplate.innerHTML;
  this.onTriggerThingSelection = this.onTriggerThingSelection.bind(this);
  this.onTriggerPropertySelection = this.onTriggerPropertySelection.bind(this);

  this.onActionThingSelection = this.onActionThingSelection.bind(this);
  this.onActionPropertySelection = this.onActionPropertySelection.bind(this);

  this.triggerThing = new Selector(
    this.elt.querySelector('.select-trigger-thing'),
    [{name: 'Thing', placeholder: true}],
    this.onTriggerThingSelection
  );

  this.triggerProperty = new Selector(
    this.elt.querySelector('.select-trigger-property'),
    [{name: 'property', placeholder: true}],
    this.onTriggerPropertySelection
  );

  this.triggerType = new Selector(
    this.elt.querySelector('.select-trigger-type'),
    [
      {value: 'LESS', name: 'less than'},
      {value: 'GREATER', name: 'greater than'},
    ]
  );

  this.triggerValue = new Selector(
    this.elt.querySelector('.select-trigger-value'),
    [{name: 'value', placeholder: true}]
  );

  this.triggerValueInput =
    this.elt.querySelector('.select-trigger-value-input');

  this.actionType = new Selector(
    this.elt.querySelector('.select-action-type'),
    [
      {value: 'SetAction', name: 'set'},
      {value: 'PulseAction', name: 'pulse'}
    ]
  );

  this.actionThing = new Selector(
    this.elt.querySelector('.select-action-thing'),
    [{name: 'Thing', placeholder: true}],
    this.onActionThingSelection
  );

  this.actionProperty = new Selector(
    this.elt.querySelector('.select-action-property'),
    [{name: 'property', placeholder: true}],
    this.onActionPropertySelection
  );

  this.actionValue = new Selector(
    this.elt.querySelector('.select-action-value'),
    [{name: 'value', placeholder: true}]
  );

  this.actionValueInput = this.elt.querySelector('.select-action-value-input');

  this.updateThingSelectors();

  if (desc) {
    this.setFromDescription(desc);
  }
}

Rule.prototype.updateThingSelectors = function() {
  this.triggerThing.updateOptions(this.gateway.things);
  this.actionThing.updateOptions(this.gateway.things);
};

Rule.prototype.updatePropertySelector = function(propertySelector, thing) {
  let properties = Object.keys(thing.properties).map(propKey => {
    return Object.assign({
      name: propKey,
    }, thing.properties[propKey]);
  });
  propertySelector.updateOptions(properties);
};

Rule.prototype.updateValueSelector = function(valueSelector, valueInput,
    property) {
  if (property.type === 'boolean') {
    valueInput.classList.add('hidden');
    valueSelector.elt.classList.remove('hidden');

    valueSelector.updateOptions([
      {value: true, name: 'true'},
      {value: false, name: 'false'}
    ]);
  } else if (property.type === 'number') {
    valueInput.classList.remove('hidden');
    valueSelector.elt.classList.add('hidden');
  }
};

Rule.prototype.onTriggerThingSelection = function(thing) {
  this.updatePropertySelector(this.triggerProperty, thing);
};

Rule.prototype.onTriggerPropertySelection = function(property) {
  this.updateValueSelector(this.triggerValue, this.triggerValueInput, property);
  if (property.type === 'number') {
    this.triggerType.elt.classList.remove('hidden');
  } else {
    this.triggerType.elt.classList.add('hidden');
  }
};

Rule.prototype.onActionThingSelection = function(thing) {
  this.updatePropertySelector(this.actionProperty, thing);
};

Rule.prototype.onActionPropertySelection = function(property) {
  this.updateValueSelector(this.actionValue, this.actionValueInput, property);
};

/**
 * Convert this rule into a serialized description
 * @return {RuleDescription}
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
    trigger: trigger,
    action: action
  };
};

/**
 * Set the properties of this rule based on a serialized description
 * @param {RuleDescription} desc
 */
Rule.prototype.setFromDescription = function(desc) {
  this.triggerProperty.select(desc.trigger.property, false);
  if (desc.trigger.type === 'BooleanTrigger') {
    this.triggerValue.select(desc.trigger.onValue, false);
  } else if (desc.trigger.type === 'LevelTrigger') {
    this.triggerType.select(desc.trigger.levelType, false);
    this.triggerValueInput.value = desc.trigger.level;
  }

  this.actionProperty.select(desc.action.property, false);

  this.actionType.select(desc.action.type, false);
  if (desc.action.property.type === 'boolean') {
    this.actionValue.select(desc.action.value, false);
  } else if (desc.action.property.type === 'number') {
    this.actionValueInput.value = desc.action.value;
  }
};
