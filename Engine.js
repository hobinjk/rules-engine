const winston = require('winston');

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

  update() {
    winston.info('engine update');
    this.getRules().forEach(rule => {
      rule.update();
    });
  }
}

module.exports = Engine;
