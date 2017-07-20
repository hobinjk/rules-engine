const winston = require('winston');

class Engine {
  constructor() {
    this.rules = [];
  }

  addRule(rule) {
    this.rules.push(rule);
  }

  update() {
    winston.info('engine update');
    this.rules.forEach(rule => {
      rule.update();
    });
  }
}

module.exports = Engine;
