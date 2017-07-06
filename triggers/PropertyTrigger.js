class PropertyTrigger extends Trigger {
  constructor(desc) {
    super();
    this.property = new Property(desc.property);
  }
}

module.exports = PropertyTrigger;
