/* global Rule */

/**
 * A summary of a Rule in card format
 * @constructor
 * @param {Gateway} gateway - global Gateway with which to communicate
 * @param {Element} elt - element into which to put the card
 * @param {String} id - unique identifier of the rule card
 * @param {RuleDescription} desc - rule description to represent
 */
function RuleCard(gateway, elt, id, desc) {
  this.elt = elt;
  this.id = id;
  this.rule = new Rule(gateway, desc);

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
        <h3>${this.rule.name}</h3>
        <p>${this.rule.toHumanDescription()}</p>
      </div>
      <form class="rule-switch">
        <input type="checkbox" id="rule-switch-${id}"
               class="rule-switch-checkbox" checked/>
        <label class="rule-switch-slider" for="rule-switch-${id}"></label>
      </form>
    `;
}

