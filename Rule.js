const winston = require('winston');

const actions = require('./actions');
const triggers = require('./triggers');

class Rule {
  constructor(trigger, action) {
    this.trigger = trigger;
    this.action = action;
  }

  update() {
    winston.info('rule update');
    return this.trigger.getState().then(state => {
      winston.info('rule state', {state: state});
      return this.action.setState(state);
    });
  }
}

Rule.fromDescription = function(desc) {
  const trigger = triggers.fromDescription(desc.trigger);
  const action = actions.fromDescription(desc.action);
  return new Rule(trigger, action);
};

module.exports = Rule;
