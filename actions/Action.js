const Property = require('../Property');

class Action {
  constructor(desc) {
    this.property = new Property(desc.property);
  }

  setState(state) {
    throw new Error('Unimplemented');
  }
}

module.exports = Action;
