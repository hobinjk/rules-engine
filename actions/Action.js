const Property = require('../Property');

class Action {
  constructor(desc) {
    this.type = this.constructor.name;
    this.property = new Property(desc.property);
  }

  setState(state) {
    throw new Error('Unimplemented');
  }
}

module.exports = Action;
