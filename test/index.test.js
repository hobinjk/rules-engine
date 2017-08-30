const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../main.js');

jest.mock('node-fetch');
jest.mock('ws');

function pFinal(p) {
  return Promise.resolve(p).catch((v) => v);
}

chai.use(chaiHttp);

afterAll(() => {
  server.close();
});

let testRule = {
  trigger: {
    property: {
      name: 'on',
      type: 'boolean',
      href:
        '/things/light1/properties/on'
    },
    type: 'BooleanTrigger',
    onValue: true
  },
  action: {
    property: {
      name: 'on',
      type: 'boolean',
      href: '/things/light1/properties/on'
    },
    type: 'PulseAction',
    value: true
  }
};

let numberTestRule = {
  name: 'Number Test Rule',
  trigger: {
    property: {
      name: 'temperature',
      type: 'number',
      href:
        '/things/thermostat/properties/temperature',
      unit: 'celsius'
    },
    type: 'LevelTrigger',
    levelType: 'LESS',
    level: 120
  },
  action: {
    property: {
      name: 'sat',
      type: 'number',
      href: '/things/light2/properties/sat',
      description: 'light color saturation'
    },
    type: 'SetAction',
    value: 30
  }
};

describe('index router', function() {
  let ruleId = null;

  it('gets a list of 0 rules', async () => {
    const res = await chai.request(server)
      .get('/rules/');
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(0);
  });

  it('fails to create a rule', async () => {
    const err = await pFinal(chai.request(server)
      .post('/rules/')
      .send({
        trigger: {
          property: null,
          type: 'Whatever'
        },
        action: testRule.action
      }));
    expect(err.response.status).toEqual(400);
  });

  it('fails to create a rule without a trigger', async () => {
    const brokenTestRule = Object.assign({}, testRule);
    delete brokenTestRule.trigger;

    const err = await pFinal(chai.request(server)
      .post('/rules/')
      .send(brokenTestRule));

    expect(err.response.status).toEqual(400);
  });

  it('fails to create a rule without a action', async () => {
    const brokenTestRule = Object.assign({}, testRule);
    delete brokenTestRule.action;

    const err = await pFinal(chai.request(server)
      .post('/rules/')
      .send(brokenTestRule));

    expect(err.response.status).toEqual(400);
  });

  it('creates a rule', async () => {
    let res = await chai.request(server)
      .post('/rules/')
      .send(testRule);

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('id');
    ruleId = res.body.id;

    res = await chai.request(server)
      .get('/rules/');
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(1);
    expect(res.body[0]).toMatchObject(testRule);
  });

  it('gets this rule specifically', async () => {
    let res = await chai.request(server)
      .get('/rules/' + ruleId);
    expect(res.status).toEqual(200);
    expect(res.body).toMatchObject(testRule);
  });

  it('fails to get a nonexistent rule specifically', async () => {
    const err = await pFinal(chai.request(server)
      .get('/rules/1337'));
    expect(err.response.status).toEqual(404);
  });


  it('modifies this rule', async () => {
    let res = await chai.request(server)
      .put('/rules/' + ruleId)
      .send(numberTestRule);
    expect(res.status).toEqual(200);

    res = await chai.request(server)
      .get('/rules/');
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(1);
    expect(res.body[0]).toMatchObject(numberTestRule);

  });

  it('deletes this rule', async () => {
    let res = await chai.request(server)
      .delete('/rules/' + ruleId)
      .send();
    expect(res.status).toEqual(200);

    res = await chai.request(server)
      .get('/rules/');
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(0);
  });

  it('fails to delete a nonexistent rule', async () => {
    const err = await pFinal(chai.request(server)
      .delete('/rules/0')
      .send());
    expect(err.response.status).toEqual(404);
  });

  it('fails to modify a nonexistent rule', async () => {
    const err = await pFinal(chai.request(server)
      .put('/rules/0')
      .send(testRule));
    expect(err.response.status).toEqual(404);
  });

  it('sets and gets a jwt', async () => {
    const jwt = 'not actually a jwt';
    const index = require('../index.js');
    index.setJWT(jwt);
    let res = await chai.request(server)
      .get('/jwt');
    expect(res.status).toEqual(200);
    expect(res.text).toEqual(jwt);
  });

});
