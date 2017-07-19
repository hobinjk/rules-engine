const assert = require('assert');
const PropertyTrigger = require('./PropertyTrigger');

class BooleanTrigger extends PropertyTrigger {
  constructor(desc) {
    super(desc);
    assert(this.property.type === 'boolean');
    assert(typeof(desc.onValue) === 'boolean');
    this.onValue = desc.onValue;
  }

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
