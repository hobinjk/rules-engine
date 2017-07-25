/* global Selector */

let ruleTemplate = document.getElementById('rule-template');

function Rule(elt, gateway, desc) {
  this.elt = elt;
  this.gateway = gateway;

  this.elt.innerHTML = ruleTemplate.innerHTML;
  this.onSelection = this.onSelection.bind(this);
  this.onTriggerThingSelection = this.onTriggerThingSelection.bind(this);
  this.onTriggerPropertySelection = this.onTriggerPropertySelection.bind(this);

  this.onActionThingSelection = this.onActionThingSelection.bind(this);
  this.onActionPropertySelection = this.onActionPropertySelection.bind(this);

  let triggerThingElt = this.elt.querySelector('.select-trigger-thing');
  this.triggerThing = new Selector(
    triggerThingElt,
    [{name: 'Thing', placeholder: true}]
  );
  triggerThingElt.addEventListener('select', this.onTriggerThingSelection);

  let triggerPropertyElt = this.elt.querySelector('.select-trigger-property');
  this.triggerProperty = new Selector(
    triggerPropertyElt,
    [{name: 'property', placeholder: true}]
  );
  triggerPropertyElt.addEventListener('select',
    this.onTriggerPropertySelection);

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

  let actionThingElt = this.elt.querySelector('.select-action-thing');
  this.actionThing = new Selector(
    actionThingElt,
    [{name: 'Thing', placeholder: true}]
  );
  actionThingElt.addEventListener('select', this.onActionThingSelection);

  let actionPropertyElt = this.elt.querySelector('.select-action-property');
  this.actionProperty = new Selector(
    actionPropertyElt,
    [{name: 'property', placeholder: true}]
  );
  actionPropertyElt.addEventListener('select', this.onActionPropertySelection);

  this.actionValue = new Selector(
    this.elt.querySelector('.select-action-value'),
    [{name: 'value', placeholder: true}]
  );

  this.actionValueInput = this.elt.querySelector('.select-action-value-input');

  this.elt.addEventListener('select', this.onSelection);

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

/**
 * On any selection, validate and save the rule
 */
Rule.prototype.onSelection = function() {
  let desc = this.toDescription();
  if (!desc) {
    this.elt.classList.remove('good');
    return;
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
    request = fetch('/rules/' + this.id, fetchOptions);
  } else {
    fetchOptions.method = 'POST';
    request = fetch('/rules/', fetchOptions).then(res => {
      return res.json();
    }).then(rule => {
      this.id = rule.id;
    });
  }
  request.then(() => {
    this.elt.classList.add('good');
  });
};

Rule.prototype.onTriggerThingSelection = function(event) {
  let thing = event.detail;
  if (thing.placeholder) {
    return;
  }
  this.updatePropertySelector(this.triggerProperty, thing);
};

Rule.prototype.onTriggerPropertySelection = function(event) {
  let property = event.detail;
  if (property.placeholder) {
    return;
  }
  this.updateValueSelector(this.triggerValue, this.triggerValueInput, property);
  if (property.type === 'number') {
    this.triggerType.elt.classList.remove('hidden');
  } else {
    this.triggerType.elt.classList.add('hidden');
  }
};

Rule.prototype.onActionThingSelection = function(event) {
  let thing = event.detail;
  if (thing.placeholder) {
    return;
  }
  this.updatePropertySelector(this.actionProperty, thing);
};

Rule.prototype.onActionPropertySelection = function(event) {
  let property = event.detail;
  if (property.placeholder) {
    return;
  }
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
    trigger: trigger,
    action: action
  };
};

/**
 * Set the properties of this rule based on a serialized description
 * @param {RuleDescription} desc
 */
Rule.prototype.setFromDescription = function(desc) {
  console.log(desc);
  this.id = desc.id;

  // Helper functions for selecting existing options instead of direct
  // selection

  function byPropertyHref(property) {
    return function(option) {
      let optProp = option.properties[property.name];
      return optProp && (optProp.href === property.href);
    };
  }

  function byValue(value) {
    return function(option) {
      return option.value === value;
    };
  }

  this.triggerThing.selectMatching(byPropertyHref(desc.trigger.property));
  this.triggerProperty.select(desc.trigger.property, false);
  if (desc.trigger.type === 'BooleanTrigger') {
    this.triggerValue.selectMatching(byValue(desc.trigger.onValue));
  } else if (desc.trigger.type === 'LevelTrigger') {
    this.triggerType.selectMatching(byValue(desc.trigger.levelType));
    this.triggerValueInput.value = desc.trigger.level;
  }

  this.actionThing.selectMatching(function(option) {
    return option.properties[desc.action.property.name].href ===
      desc.action.property.href;
  });

  this.actionProperty.select(desc.action.property, false);

  this.actionType.selectMatching(byValue(desc.action.type));
  if (desc.action.property.type === 'boolean') {
    this.actionValue.selectMatching(byValue(desc.action.value));
  } else if (desc.action.property.type === 'number') {
    this.actionValueInput.value = desc.action.value;
  }
};
