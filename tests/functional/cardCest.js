process.env.NODE_ENV = 'test';

const app = require('../../Backend/app.js');
const superagent = require('superagent');
const assert = require('assert');
const functionalHelper = require('../common/functionalHelper');
describe('contact ', function() {
  this.timeout(150000);
  let accessToken = null;

  before(async () => {

    //Create a new user
    let newUserName = 'ABCDEF' + Math.random();
    const token = await functionalHelper.createUser(newUserName, '1235');

    //Create a project


    accessToken=token;
    //Create user and logins in with x-access accessToken

    //Use the xaccess token to authenticate
    //console.log(accessToken);\
  });
  it('Test adding new cards', async () => {
    this.timeout(150000);
    const postBody={
      card_state:'In Prog',
      toDoItemTitle:'Hello world',
      toDoItemDetail:'Hello world',
      assignedTo:[],
      isGitTask:true
    };
    const response=await superagent.post('localhost:8080/card/create')
                                  .set('x-access-token',accessToken)
                                  .send(postBody);
    console.log(response);
    //    console.log('response ',responseStr);
  });

  it('test api call', async function() {

  });
  it('should show a form');

  it('should display modal');
});
