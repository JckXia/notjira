process.env.NODE_ENV = 'test';

const app = require('../../Backend/app.js');
const superagent = require('superagent');
const assert = require('assert');
const functionalHelper = require('../common/functionalHelper');
describe('contact ', function() {

  let adminUserName = null;
  let adminUserCreationResp = null;

  let creatorUserName = null;
  let creatorUserCreationResp = null;

  let createdProjectInfo = null;

  before(async () => {

    //Create a new user

    adminUserName = 'Proj Creator' + Math.random();
    adminUserCreationResp = await functionalHelper.createUser(adminUserName, '12345');

    creatorUserName = 'Proj Creator' + Math.random();
    creatorUserCreationResp = await functionalHelper.createUser(creatorUserName, '12345');


  });

  it('Test creatig project', async () => {

    const queryData = {
      repoName: 'gitDemo',
      repoOwnerName: 'JckXia',
      projectAdminPk: adminUserCreationResp.id,
      projectAdminUserName: adminUserName,
      projectCreatorName: creatorUserName,
      projectCreatorPk: creatorUserCreationResp.id,
      projectParticipants: []
    };
    let projectCreationResp = await superagent.post('localhost:8080/project/create')
      .set('x-access-token', creatorUserCreationResp.token)
      .query(queryData);

    let resp = JSON.stringify(projectCreationResp);
    resp = JSON.parse(resp);
    resp = JSON.parse(resp.text);
    createdProjectInfo = resp;
    //   superagent.post('localhost:8080/project/create');
  });

  it('Test getting the newly created project', async () => {


    let projectId = createdProjectInfo._id;

    let url = 'localhost:8080/project/' + projectId;
    let project = await superagent.get(url)
      .set('x-access-token', adminUserCreationResp.token);

    console.log(project);
    //  let project2=await superagent.get(url);


    /*
      let projectId=createdProjectInfo._id;
      let url='localhost:8080/project/'+projectId;
      let project=await superagent.get(url);
      */
    //  let project=await superagent.get(url);
    //  console.log(project);
    //let project=await superagent.get('localhost:8080/project/'+projectId);

  });
  it('Test adding new cards', async () => {

    //    console.log('response ',responseStr);
  });

  it('test api call', async function() {

  });
  it('should show a form');

  it('should display modal');
});
