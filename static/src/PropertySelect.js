function PropertySelect(parent, options) {
  this.elt = document.createElement('div');
  this.elt.classList.add('property-select');

  this.onClick = this.onClick.bind(this);
  this.elt.addEventListener('click', this.onClick);

  this.addOption({
    name: 'Select Property',
    value: ''
  });

  for (let option of options) {
    this.addOption(option);
  }

  this.elt.querySelector('.property-select-option').classList.add('selected');

  // Disable dragging started by clicking property select
  this.elt.addEventListener('mousedown', function(e) {
    e.stopPropagation();
  });

  parent.appendChild(this.elt);
}

PropertySelect.prototype.addOption = function(option) {
  let elt = document.createElement('div');
  elt.classList.add('property-select-option');
  elt.dataset.value = option.value;
  elt.textContent = option.name;
  this.elt.appendChild(elt);
};

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
