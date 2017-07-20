const assert = require('assert');
const config = require('config');
const fetch = require('node-fetch');
const winston = require('winston');

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

  getHref() {
    return config.get('gateway') + this.href + '?jwt=' + config.get('jwt');
  }

  get() {
    winston.info('property got', {name: this.name});
    return fetch(this.getHref()).then(res => {
      return res.json();
    }).then(data => {
      winston.info('property got', {data: data});
      return data[this.name]
    });
  }

  set(value) {
    let data = {};
    data[this.name] = value;
    winston.info('property set', {data: data});
    return fetch(this.getHref(), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      cors: true
    });
  }
}

module.exports = Property;
