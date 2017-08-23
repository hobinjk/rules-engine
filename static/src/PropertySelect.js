function PropertySelect(elt) {
  this.elt = elt;
  this.onClick = this.onClick.bind(this);
  this.elt.addEventListener('click', this.onClick);
}

PropertySelect.prototype.onClick = function(e) {
  this.elt.classList.toggle('open');
  let selected = this.elt.querySelector('.selected');
  if (selected) {
    if (!selected.dataset.value) {
      this.elt.removeChild(selected);
    } else {
      selected.classList.remove('selected');
    }
  }
  e.target.classList.add('selected');
};
