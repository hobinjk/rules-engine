/* global Draggable, PropertySelect */

let blocks = document.querySelectorAll('.device-property-block');

function onDown() {
  let openSelector = this.elt.querySelector('.open');
  if (openSelector) {
    openSelector.classList.remove('open');
  }
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
}

for (let block of blocks) {
  new Draggable(block, onDown, onMove, onUp);
  new PropertySelect(block.querySelector('.property-select'));

}
