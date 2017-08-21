function RuleCard(elt, id, desc) {
  this.elt = elt;
  this.id = id;
  this.desc = desc;

    this.elt.innerHTML = `
      <div class="rule-edit-overlay">
        <div class="rule-delete-button"></div>
        <input class="rule-edit-button" type="button" value="Edit Rule"/>
        <div class="rule-delete-dialog">
          <p>Are you sure you want to remove this rule permanently?</p>
          <input class="rule-delete-cancel-button" type="button"
                 value="Cancel"/>
          <input class="rule-delete-confirm-button" type="button"
                 value="Remove Rule"/>
        </div>
      </div>
      <div class="rule-preview">
        <div class="device-block trigger">
          <img class="device-icon" src="images/onoff.svg" width="48px"
               height="48px"/>
        </div>
        <div class="device-block action">
          <img class="device-icon" src="images/onoff.svg" width="48px"
               height="48px"/>
        </div>
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

