const assert = require('assert');
const PropertyTrigger = require('./PropertyTrigger');

const LevelTriggerTypes = {
  LESS: 'LESS',
  GREATER: 'GREATER'
};

class LevelTrigger extends PropertyTrigger {
  constructor(desc) {
    super(desc);
    assert(this.property.type === 'number');
    assert(typeof desc.level === 'number');
    assert(LevelTriggerTypes[desc.levelType]);

    this.level = desc.level;
    this.levelType = desc.levelType;
  }

  getState() {
    return this.property.get().then(propValue => {
      let on = false;

      switch (this.type) {
        case LevelTriggerTypes.LESS:
          if (propValue < this.level) {
            on = true;
          }
          break;
        case LevelTriggerTypes.GREATER:
          if (propValue > this.level) {
            on = true;
          }
          break;
      }

      return {on: on, value: propValue};
    });
  }
}

LevelTrigger.types = LevelTriggerTypes;

module.exports = LevelTrigger;
