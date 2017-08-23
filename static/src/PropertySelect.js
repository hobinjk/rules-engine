function PropertySelect(elt) {
  this.elt = elt;
  this.onClick = this.onClick.bind(this);
  this.elt.addEventListener('click', this.onClick);
}

PropertySelect.prototype.onClick = function() {
  this.elt.classList.toggle('open');
};
