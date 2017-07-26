let gatewayUrl = 'https://localhost:4443';

function Gateway() {
  this.things = null;
}

Gateway.prototype.readThings = function() {
  return fetch(gatewayUrl + '/things?jwt=' + jwt).then(res => {
    return res.json();
  }).then(things => {
    this.things = things;
  });
};
