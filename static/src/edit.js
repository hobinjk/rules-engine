/* global Draggable, Gateway, PropertySelect */

let gateway = new Gateway();

let deleteArea = document.getElementById('delete-area');
let devicesList = document.getElementById('devices-list');
let blocks = document.querySelectorAll('.device-property-block');

function onDown() {
  let openSelector = this.elt.querySelector('.open');
  if (openSelector) {
    openSelector.classList.remove('open');
  }
  deleteArea.classList.add('delete-active');
  this.elt.classList.add('dragging');
}

function onMove(clientX, clientY, relX, relY) {
  let grid = 40;
  let x = Math.floor((relX - grid / 2) / grid) * grid
        + grid / 2;
  let y = Math.floor((relY - grid / 2) / grid) * grid
        + grid / 2;
  this.elt.style.transform = 'translate(' + x + 'px,' + y + 'px)';
}

function onUp() {
  this.elt.classList.remove('dragging');
  deleteArea.classList.remove('delete-active');
}

for (let block of blocks) {
  new Draggable(block, onDown, onMove, onUp);
  new PropertySelect(block.querySelector('.property-select'));
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
    new Draggable(elt, onDown, onMove, onUp);
    devicesList.appendChild(elt);
  }
});
