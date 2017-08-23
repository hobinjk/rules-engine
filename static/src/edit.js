/* global DevicePropertyBlock, Gateway, Rule */

let gateway = new Gateway();
let rule = new Rule(gateway);
console.log(rule);

let ruleArea = document.getElementById('rule-area');
let devicesList = document.getElementById('devices-list');

function onDeviceBlockDown(event) {
  let deviceRect = event.target.getBoundingClientRect();

  let x = deviceRect.left;
  let y = deviceRect.top;
  console.log(x, y);
  let newBlock = new DevicePropertyBlock(ruleArea, this, x, y);

  newBlock.draggable.onDown(event);
}

function makeDeviceElt(thing) {
  let elt = document.createElement('div');
  elt.classList.add('device');

  elt.innerHTML = `<div class="device-block">
    <img class="device-icon" src="images/onoff.svg" width="48px"
         height="48px"/>
  </div>
  <p>${thing.name}</p>`;

  return elt;
}

gateway.readThings().then(things => {
  for (let thing of things) {
    let elt = makeDeviceElt(thing);
    elt.addEventListener('mousedown', onDeviceBlockDown.bind(thing));
    devicesList.appendChild(elt);
  }
  new DevicePropertyBlock(ruleArea, things[0], 100, 100);
});
