function Selector(elt, options) {
  this.elt = elt;
  this.options = options;
  this.onClick = this.onClick.bind(this);
  this.onSelectedClick = this.onSelectedClick.bind(this);

  this.selected = document.createElement('span');
  this.selected.classList.add('selected');
  this.selected.addEventListener('click', this.onSelectedClick);
  this.select(options[0], true);
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
  this.select(option, true);
  this.hide();
};

/**
 * Select a single option
 * @param {Object} option
 * @param {boolean} isRealOption - If not a real option, confirm that `option`
 * is present in `this.options`, marking it as an invalid placeholder if not.
 */
Selector.prototype.select = function(option, isRealOption) {
  if (!isRealOption) {
    for (let realOption of this.options) {
      // TODO while correct in 100% of current cases, this would be better
      // served by deep equality
      if (option.name === realOption.name) {
        isRealOption = true;
        break;
      }
    }
    if (!isRealOption) {
      option.placeholder = true;
    }
  }

  this.selectedOption = option;
  this.selected.textContent = option.name;
  if (option.placeholder) {
    this.selected.classList.add('selected-placeholder');
  } else {
    this.selected.classList.remove('selected-placeholder');
  }
  let event = new CustomEvent('select', {detail: option, bubbles: true});
  this.elt.dispatchEvent(event);
};

/**
 * Select an existing option based on a criteria function
 * @param {Function<Object, boolean>} criteria
 */
Selector.prototype.selectMatching = function(criteria) {
  for (let option of this.options) {
    if (criteria(option)) {
      this.select(option, true);
      return;
    }
  }
};
