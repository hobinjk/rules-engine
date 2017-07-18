function Selector(elt, options, onSelection) {
  this.elt = elt;
  this.options = options;
  this.onSelection = onSelection;
  this.onClick = this.onClick.bind(this);
  this.onSelectedClick = this.onSelectedClick.bind(this);

  this.selected = document.createElement('span');
  this.selected.classList.add('selected');
  this.selected.addEventListener('click', this.onSelectedClick);
  this.select(options[0]);
  this.elt.appendChild(this.selected);

  this.createOptionsList();
  this.elt.appendChild(this.optionsList);
}

Selector.prototype.createOptionsList = function() {
  this.optionsList = document.createElement('ul');
  this.optionsList.classList.add('options');
  this.updateOptions(this.options);
};

Selector.prototype.updateOptions = function(options) {
  this.options = options;
  this.optionsList.innerHTML = '';

  this.options.forEach(option => {
    let optionElt = document.createElement('li');
    optionElt.classList.add('option');
    optionElt.textContent = option.name;
    this.optionsList.appendChild(optionElt);
  });

  if (this.options.length > 0 && !this.options[0].placeholder) {
    this.selected.classList.add('with-options');
  }
};

Selector.prototype.show = function(event) {
  if (this.optionsList.classList.contains('shown')) {
    return;
  }
  document.body.addEventListener('click', this.onClick);
  this.optionsList.classList.add('shown');
  event.stopPropagation();
};

Selector.prototype.hide = function(event) {
  if (!this.optionsList.classList.contains('shown')) {
    return;
  }
  document.body.removeEventListener('click', this.onClick);
  this.optionsList.classList.remove('shown');
  if (event) {
    event.stopPropagation();
  }
};

Selector.prototype.onSelectedClick = function(event) {
  if (this.selected.classList.contains('with-options')) {
    this.show(event);
  }
};

Selector.prototype.onClick = function(event) {
  let optionElt = event.target;
  if (!optionElt.classList.contains('option')) {
    this.hide();
    return;
  }

  let index = [].slice.call(this.optionsList.children).indexOf(optionElt);
  if (index < 0) {
    this.hide();
    return;
  }

  let option = this.options[index];
  this.select(option);
  if (this.onSelection) {
    this.onSelection(option);
  }
  this.hide();
};

Selector.prototype.select = function(option) {
  this.selectedOption = option;
  this.selected.textContent = option.name;
  if (option.placeholder) {
    this.selected.classList.add('selected-placeholder');
  } else {
    this.selected.classList.remove('selected-placeholder');
  }
};
