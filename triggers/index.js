const triggers = {
  BooleanTrigger: require('./BooleanTrigger'),
  LevelTrigger: require('./LevelTrigger'),
  PropertyTrigger: require('./PropertyTrigger'),
  Trigger: require('./Trigger')
};

function fromDescription(desc) {
  let TriggerClass = triggers[desc.type];
  if (!TriggerClass) {
    throw new Error('Unsupported or invalid trigger type:' + desc.type);
  }
  return new TriggerClass(desc);
}

module.exports = {
  triggers: triggers,
  fromDescription: fromDescription
};
