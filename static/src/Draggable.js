/**
 * @constructor
 * @param {Element} elt - draggable element
 */
function Draggable(elt, afterDown, afterMove, afterUp) {
  this.elt = elt;
  this.afterDown = afterDown;
  this.afterMove = afterMove;
  this.afterUp = afterUp;
  let parentRect = this.elt.parentNode.getBoundingClientRect();
  this.baseX = parentRect.left;
  this.baseY = parentRect.top;
  this.onDown = this.onDown.bind(this);
  this.onMove = this.onMove.bind(this);
  this.onUp = this.onUp.bind(this);
  elt.addEventListener('mousedown', this.onDown);
}

Draggable.prototype.onDown = function(event) {
  window.addEventListener('mousemove', this.onMove);
  window.addEventListener('mouseup', this.onUp);
  event.preventDefault();
  if (this.afterDown) {
    this.afterDown(event.clientX, event.clientY);
  }
};

Draggable.prototype.onMove = function(event) {
  let x = event.clientX - this.baseX;
  let y = event.clientY - this.baseY;

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

