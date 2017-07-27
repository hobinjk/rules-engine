/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

/* global Gateway, Rule */

let addRuleButton = document.getElementById('add-rule');
let rulesList = document.getElementById('rules');
let gateway = new Gateway();

/**
 * @return {Promise<Array<RuleDescription>>}
 */
function readRules() {
  return fetch('rules').then(res => {
    return res.json();
  }).then(fetchedRules => {
    for (let ruleDesc of fetchedRules) {
      addRule(ruleDesc);
    }
  });
}

/**
 * Add a rule, optionally filling it with the data from a RuleDescription
 * @param {RuleDescription?} desc
 */
function addRule(desc) {
  let ruleElt = document.createElement('li');
  ruleElt.classList.add('rule');
  new Rule(ruleElt, gateway, desc);
  rulesList.appendChild(ruleElt);
}

gateway.readThings().then(() => {
  return readRules();
}).then(() => {
  addRuleButton.addEventListener('click', () => {
    addRule();
  });
});
