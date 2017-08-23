/* global Draggable, PropertySelect */


function DevicePropertyBlock(parent, thing, x, y) {
  this.elt = document.createElement('div');
  this.elt.classList.add('device-property-block');
  this.elt.style.transform = 'translate(' + x + 'px,' + y + 'px)';
  this.elt.innerHTML = `<div class="device-block">
      <img class="device-icon" src="images/onoff.svg" width="48px"
           height="48px"/>
    </div>
    <div class="device-property-info">
      <h3 class="device-name">
        ${thing.name}
      </h3>
      <!-- ideally this could be a styled select -->
    </div>`;
  let devicePropertyInfo = this.elt.querySelector('.device-property-info');
  let propertyOptions = Object.keys(thing.properties).map(propName => {
    return {
      name: propName[0].toUpperCase() + propName.substr(1),
      value: propName
    };
  });
  this.propertySelect = new PropertySelect(devicePropertyInfo, propertyOptions);

  this.onDown = this.onDown.bind(this);
  this.onMove = this.onMove.bind(this);
  this.onUp = this.onUp.bind(this);

  parent.appendChild(this.elt);
  this.draggable = new Draggable(this.elt, this.onDown,
    this.onMove, this.onUp);
}

DevicePropertyBlock.prototype.onDown = function() {
  let openSelector = this.elt.querySelector('.open');
  if (openSelector) {
    openSelector.classList.remove('open');
  }

  let deleteArea = document.getElementById('delete-area');
  deleteArea.classList.add('delete-active');
  this.elt.classList.add('dragging');
};

DevicePropertyBlock.prototype.onMove = function(clientX, clientY, relX, relY) {
  let grid = 40;
  console.log('clientX', clientX);
  console.log('clientY', clientY);
  console.log('relX', relX);
  console.log('relY', relY);
  let x = Math.floor((relX - grid / 2) / grid) * grid
        + grid / 2;
  let y = Math.floor((relY - grid / 2) / grid) * grid
        + grid / 2;
  if (y < grid / 2) {
    y = grid / 2;
  }
  this.elt.style.transform = 'translate(' + x + 'px,' + y + 'px)';
};

DevicePropertyBlock.prototype.onUp = function(clientX, clientY) {
  let devicesList = document.getElementById('devices-list');
  let devicesListHeight = devicesList.getBoundingClientRect().height;

  if (clientY > window.innerHeight - devicesListHeight) {
    console.log('would delete');
  }
  this.elt.classList.remove('dragging');
  let deleteArea = document.getElementById('delete-area');
  deleteArea.classList.remove('delete-active');
};
