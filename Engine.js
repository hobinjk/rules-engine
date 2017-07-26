/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

const winston = require('winston');

/**
 * An engine for running and managing list of rules
 */
class Engine {
  constructor() {
    this.rules = {};
    this.nextRuleId = 0;
  }

  /**
   * Get a list of all current rules
   * @return {Array<Rule>} rules
   */
  getRules() {
    return Object.keys(this.rules).map(key => {
      return this.rules[key];
    });
  }

  /**
   * Add a new rule to the engine's list
   * @param {Rule} rule
   * @return {number} rule id
   */
  addRule(rule) {
    let ruleId = this.nextRuleId;
    this.nextRuleId += 1;
    rule.id = ruleId;
    this.rules[ruleId] = rule;
    return ruleId;
  }

  /**
   * Update an existing rule
   * @param {number} rule id
   * @param {Rule} rule
   */
  updateRule(ruleId, rule) {
    if (!this.rules[ruleId]) {
      throw new Error('Nonexistent rule: ' + ruleId);
    }
    this.rules[ruleId] = rule;
    rule.id = parseInt(ruleId);
  }

  /**
   * Delete an existing rule
   * @param {number} rule id
   */
  deleteRule(ruleId) {
    if (!this.rules[ruleId]) {
      throw new Error('Nonexistent rule: ' + ruleId);
    }
    delete this.rules[ruleId];
  }

  /**
   * Update all active rules
   */
  update() {
    winston.info('engine update');
    this.getRules().forEach(rule => {
      rule.update();
    });
  }
}

module.exports = Engine;
