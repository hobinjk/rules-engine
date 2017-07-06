const triggers = require('./triggers');
const actions = require('./actions');

class Rule {
  constructor(trigger, action) {
    this.trigger = trigger;
    this.action = action;
  }

  update() {
    return this.trigger.getState().then(state => {
      return this.action.setState(state);
    });
  }
}

Rule.fromDescription = function(desc) {
  const trigger = triggers.fromDescription(desc.trigger);
  const action = actions.fromDescription(desc.action);
  return new Rule(trigger, action);
};
