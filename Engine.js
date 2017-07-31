/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

const Database = require('./Database');
const Rule = require('./Rule');

/**
 * An engine for running and managing list of rules
 */
class Engine {
  constructor() {
  }

  /**
   * Get a list of all current rules
   * @return {Array<Rule>} rules
   */
  getRules() {
    if (typeof this.rules === undefined) {
      return Promise.resolve(this.rules);
    }

    return Database.getRules().then(ruleDescs => {
      this.rules = {};
      for (let ruleId in ruleDescs) {
        ruleDescs[ruleId].id = parseInt(ruleId);
        this.rules[ruleId] = Rule.fromDescription(ruleDescs[ruleId]);
      }
      return Object.keys(ruleDescs).map(ruleId => {
        return ruleDescs[ruleId];
      });
    });
  }

  /**
   * Add a new rule to the engine's list
   * @param {Rule} rule
   * @return {Promise<number>} rule id
   */
  addRule(rule) {
    return Database.createRule(rule.toDescription()).then(id => {
      rule.id = id;
      this.rules[id] = rule;
      return id;
    });
  }

  /**
   * Update an existing rule
   * @param {number} rule id
   * @param {Rule} rule
   * @return {Promise}
   */
  updateRule(ruleId, rule) {
    if (!this.rules[ruleId]) {
      return Promise.reject(new Error('Rule ' + ruleId + ' does not exist'));
    }
    return Database.updateRule(ruleId, rule.toDescription()).then(() => {
      this.rules[ruleId] = rule;
    });
  }

  /**
   * Delete an existing rule
   * @param {number} rule id
   * @return {Promise}
   */
  deleteRule(ruleId) {
    if (!this.rules[ruleId]) {
      return Promise.reject(
        new Error('Rule ' + ruleId + ' already does not exist'));
    }
    return Database.deleteRule(ruleId).then(() => {
      delete this.rules[ruleId];
    });
  }
}

module.exports = Engine;
