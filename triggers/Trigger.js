class Trigger {
  constructor() {
    this.type = this.constructor.name;
  }

  getState() {
    throw new Error('Unimplemented');
  }
}

module.exports = Trigger;
