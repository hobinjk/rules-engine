/**
 * A hand-coded <select>-like element which allows the selection of one of a
 * thing's properties. In a perfect world this would be a styled select, but
 * this is not a perfect world.
 * @constructor
 * @param {Element} parent
 * @param {Rule} rule
 * @param {ThingDescription} thing
 */
function PropertySelect(parent, rule, thing) {
  this.rule = rule;
  this.thing = thing;
  this.role = '';

  this.elt = document.createElement('div');
  this.elt.classList.add('property-select');

  this.onClick = this.onClick.bind(this);
  this.elt.addEventListener('click', this.onClick);

  this.clearOptions();

  // Disable dragging started by clicking property select
  this.elt.addEventListener('mousedown', function(e) {
    e.stopPropagation();
  });

  parent.appendChild(this.elt);
}

/**
 * Reset the options list to only include the placeholder Select Property
 */
PropertySelect.prototype.clearOptions = function() {
  this.elt.innerHTML = '';
  this.addOption('Select Property', null, true);
};

/**
 * Add an option to the options list
 * @param {String} name - text content of option
 * @param {Object} value - associated data
 * @param {boolean} selected - if the option is selected
 */
PropertySelect.prototype.addOption = function(name, value, selected) {
  let elt = document.createElement('div');
  elt.classList.add('property-select-option');
  if (selected) {
    elt.classList.add('selected');
  }
  elt.dataset.value = JSON.stringify(value);
  elt.textContent = name;
  this.elt.appendChild(elt);
};

/**
 * Updates available options based on the PropertySelector's
 * DevicePropertyBlock's role.
 * @param {'trigger'|'action'} role
 */
PropertySelect.prototype.updateOptionsForRole = function(role) {
  if (this.role === role) {
    return;
  }
  this.role = role;

  this.clearOptions();

  for (let propName of Object.keys(this.thing.properties)) {
    let property = this.thing.properties[propName];
    if (!property.name) {
      property.name = propName;
    }
    if (role === 'trigger') {
      if (property.type === 'boolean') {
        let triggerOn = {
          type: 'BooleanTrigger',
          property: property,
          onValue: true
        };
        let triggerOff = Object.assign({}, triggerOn, {
          onValue: false
        });
        this.addOption('On', {
          trigger: triggerOn
        });
        this.addOption('Off', {
          trigger: triggerOff
        });
      }
    } else if (role === 'action') {
      if (property.type === 'boolean') {
        let actionOn = {
          type: 'PulseAction',
          property: property,
          value: true
        };
        let actionOff = Object.assign({}, actionOn, {
          value: false
        });
        this.addOption('On', {
          action: actionOn
        });
        this.addOption('Off', {
          action: actionOff
        });
      }
    }
  }
};

/**
 * Select an option when the user clicks it
 * @param {Event} e
 */
PropertySelect.prototype.onClick = function(e) {
  this.elt.classList.toggle('open');
  let selected = this.elt.querySelector('.selected');
  if (selected) {
    if (!JSON.parse(selected.dataset.value)) {
      this.elt.removeChild(selected);
    } else {
      selected.classList.remove('selected');
    }
  }
  e.target.classList.add('selected');
  let rulePart = JSON.parse(e.target.dataset.value);
  if (!rulePart) {
    return;
  }
  if (rulePart.trigger) {
    this.rule.setTrigger(rulePart.trigger);
  }
  if (rulePart.action) {
    this.rule.setAction(rulePart.action);
  }
};
