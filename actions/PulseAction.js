const assert = require('assert');
const Action = require('./Action');

class PulseAction extends Action {
  constructor(desc) {
    super(desc);
    this.value = desc.value;
    assert(typeof this.value === this.property.type);
    this.on = false;
    this.oldValue = null;
  }

  setState(state) {
    if (!this.on && state.on) {
      this.property.get().then(value => {
        this.oldValue = value;
        this.on = true;
        return this.property.set(this.value);
      });
    }
    if (this.on && !state.on) {
      this.on = false;
      return this.property.set(this.oldValue);
    }
  }
}

module.exports = PulseAction;
