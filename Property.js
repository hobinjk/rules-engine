const assert = require('assert');

class Property {
  constructor(desc) {
    assert(desc.type);
    assert(desc.href);

    this.type = desc.type;
    this.href = desc.href;
    if (desc.unit) {
      this.unit = desc.unit;
    }
    if (desc.description) {
      this.description = desc.description;
    }
    const parts = this.href.split('/');
    this.name = parts[parts.length - 1];
  }

  get() {
    return fetch(config.get('gateway') + this.href).then(res => {
      return res.json();
    }).then(data => {
      return data[this.name]
    });;
  }
}

module.exports = Property;
