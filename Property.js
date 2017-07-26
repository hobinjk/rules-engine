/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

const assert = require('assert');
const config = require('config');
const fetch = require('node-fetch');
const winston = require('winston');

/**
 * Utility to support operations on Thing's properties
 */
class Property {
  /**
   * Create a Property from a descriptor returned by the WoT API
   * @param {PropertyDescription} desc
   */
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

  /**
   * @return {String} full property href
   */
  getHref() {
    return config.get('gateway') + this.href + '?jwt=' + config.get('jwt');
  }

  /**
   * @return {Promise} resolves to property's value
   */
  get() {
    winston.info('property got', {name: this.name});
    return fetch(this.getHref()).then(res => {
      return res.json();
    }).then(data => {
      winston.info('property got', {data: data});
      return data[this.name]
    });
  }

  /**
   * @param {any} value
   * @return {Promise} resolves if property is set to value
   */
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
