/* global Gateway, Rule */

let addRuleButton = document.getElementById('add-rule');
let rulesList = document.getElementById('rules');
let rules = [];
let gateway = new Gateway();

function readRules() {
  return fetch('/rules').then(res => {
    return res.json();
  }).then(fetchedRules => {
    for (let ruleDesc of fetchedRules) {
      addRule(ruleDesc);
    }
  });
}

function addRule(desc) {
  let ruleElt = document.createElement('li');
  ruleElt.classList.add('rule');
  let rule = new Rule(ruleElt, gateway, desc);
  rules.push(rule);
  rulesList.appendChild(ruleElt);
}

gateway.readThings().then(() => {
  return readRules();
}).then(() => {
  addRuleButton.addEventListener('click', () => {
    addRule();
  });
});
