/**
 * @constructor
 * @param {Element} elt - draggable element
 */
function Draggable(elt, afterDown, afterMove, afterUp) {
  this.elt = elt;
  this.afterDown = afterDown;
  this.afterMove = afterMove;
  this.afterUp = afterUp;
  this.startX = 0;
  this.startY = 0;
  this.onDown = this.onDown.bind(this);
  this.onMove = this.onMove.bind(this);
  this.onUp = this.onUp.bind(this);
  elt.addEventListener('mousedown', this.onDown);
  this.titleHeight = document.getElementById('title-bar')
    .getBoundingClientRect().height;
  this.deviceListHeight = document.getElementById('devices-list')
    .getBoundingClientRect().height;
}

Draggable.prototype.onDown = function(event) {
  let currentTransform = this.elt.style.transform;
  let matches = /translate\((\d+)px, *(\d+)px\)/.exec(currentTransform);
  let x = 0;
  let y = 0;
  if (matches) {
    x = parseFloat(matches[1]);
    y = parseFloat(matches[2]);
  }
  this.startX = event.clientX - x;
  this.startY = event.clientY - y;
  window.addEventListener('mousemove', this.onMove);
  window.addEventListener('mouseup', this.onUp);
  event.preventDefault();
  if (this.afterDown) {
    this.afterDown(event.clientX, event.clientY);
  }
};

Draggable.prototype.onMove = function(event) {
  let x = event.clientX - this.startX;
  let y = event.clientY - this.startY;

  this.elt.style.transform = 'translate(' + x + 'px,' + y + 'px)';
  if (this.afterMove) {
    this.afterMove(event.clientX, event.clientY, x, y);
  }
};

Draggable.prototype.onUp = function(event) {
  window.removeEventListener('mousemove', this.onMove);
  window.removeEventListener('mouseup', this.onUp);
  if (this.afterUp) {
    this.afterUp(event.clientX, event.clientY);
  }
};

