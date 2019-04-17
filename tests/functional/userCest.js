process.env.NODE_ENV = 'test';

const app = require('../../Backend/app.js');
const superagent = require('superagent');
const assert = require('assert');
const functionalHelper = require('../common/functionalHelper');
describe('contact ', function() {
  let userName = null;
  let userCreationResp = null;

  before(async () => {

    userName = 'UserName ' + Math.random();
    userCreationResp = await functionalHelper.createUser(userName, '1234');

  });

  it('test logging in', async () => {
    console.log(userCreationResp.token);
  });

  it('Test search an user by id', async () => {


    const userSearchResult = await superagent.get('localhost:8080/user/' + userCreationResp.id)
      .set('x-access-token', userCreationResp.token);
    //  console.log(JSON.stringify(userSearchResult));
  });

  it('Test searching user by username ', async () => {
    const query = {
      username: userName
    }
    const userSearchResult = await superagent.get('localhost:8080/user/username')
      .set('x-access-token', userCreationResp.token)
      .query(query);
    //            console.log(JSON.stringify(userSearchResult));
    //  console.log(JSON.stringify(userSearchResult));
  });

  it('Test add a project to user profile', async () => {
    const queryData = {
      project_id: '123xv12'
    }
    let projectAddRes = await superagent.post('localhost:8080/user/add/project/' + userCreationResp.id)
      .set('x-access-token', userCreationResp.token)
      .query(queryData);
    projectAddRes = JSON.stringify(projectAddRes);
    projectAddRes = JSON.parse(projectAddRes);
    //  console.log(projectAddRes);

    let projectSearchRes = await superagent.get('localhost:8080/user/username')
      .set('x-access-token', userCreationResp.token)
      .query({
        username: userName
      });
    projectSearchRes = JSON.stringify(projectSearchRes);
    projectSearchRes = JSON.parse(projectSearchRes);
    console.log(projectSearchRes);

  });

  it('Remove a project from the user profile', async () => {
    //Assume above function runs normally
    const queryData = {
      project_id: '123xv12'
    }
    let projectDeleteRes = await superagent.post('localhost:8080/user/delete/project/' + userCreationResp.id)
      .set('x-access-token', userCreationResp.token)
      .query(queryData);

    let projectSearchRes = await superagent.get('localhost:8080/user/username')
      .set('x-access-token', userCreationResp.token)
      .query({
        username: userName
      });
    projectSearchRes = JSON.stringify(projectSearchRes);
    projectSearchRes = JSON.parse(projectSearchRes);
    console.log(projectSearchRes);

  });

});
