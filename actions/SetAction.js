const assert = require('assert');
const Action = require('./Action');

class SetAction extends Action {
  constructor(desc) {
    super(desc);
    this.value = desc.value;
    assert(typeof this.value === this.property.type,
      'setpoint and property must be same type');
    this.on = false;
  }

  setState(state) {
    if (!this.on && state.on) {
      this.on = true;
      return this.property.set(this.value);
    }
    if (this.on && !state.on) {
      this.on = false;
      return Promise.resolve();
    }
  }
}

module.exports = SetAction;
