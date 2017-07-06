const assert = require('assert');

const actions = {
  Action: require('./Action'),
  SetAction: require('./SetAction'),
  PulseAction: require('./PulseAction')
};

function fromDescription(desc) {
  let ActionClass = actions[desc.type];
  if (!ActionClass) {
    throw new Error('Unsupported or invalid action type:' + desc.type);
  }
  return new ActionClass(desc);
}

module.exports = {
  actions: actions,
  fromDescription: fromDescription
};
