/* global Gateway, Rule */

let addRuleButton = document.getElementById('add-rule');
let rulesList = document.getElementById('rules');
let rules = [];
let gateway = new Gateway();

gateway.readThings().then(function() {
  addRuleButton.addEventListener('click', function() {
    let ruleElt = document.createElement('li');
    ruleElt.classList.add('rule');
    let rule = new Rule(ruleElt, gateway);
    rules.push(rule);
    rulesList.appendChild(ruleElt);
  });
});
