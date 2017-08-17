function RuleCard(elt, id, desc) {
  this.elt = elt;
  this.id = id;
  this.desc = desc;

    this.elt.innerHTML = `
      <div class="rule-preview">
        <div class="device-icon trigger"></div>
        <div class="device-icon action"></div>
      </div>
      <div class="rule-info">
        <h3>${this.getName()}</h3>
        <p>${this.getHumanDesc()}</p>
      </div>
      <form class="rule-switch">
        <input type="checkbox" id="rule-switch-${id}"
               class="rule-switch-checkbox" checked/>
        <label class="rule-switch-slider" for="rule-switch-${id}"></label>
      </form>
    `;
}

RuleCard.prototype.getName = function() {
  return `Rule Name`;
};

RuleCard.prototype.getHumanDesc = function() {
  // let thing = things.smething;
  return `if trigger thing's property is value then set|pulse trigger action's
  property to value`;
}

