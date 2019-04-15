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
    //Getting the project with valid tokens
    let url = 'localhost:8080/project/' + projectId;
    let project = await superagent.get(url)
      .set('x-access-token', adminUserCreationResp.token);

    console.log(JSON.stringify(project));

  });
  it('Test adding new cards', async () => {

    let projectId = createdProjectInfo._id;
    let card = '123eFasC4DSxAsds5';

    const postData = {
      card_id: card
    };

    let url = 'localhost:8080/project/' + projectId + '/cards/add';

    let addRes = await superagent.post(url)
      .set('x-access-token', adminUserCreationResp.token)
      .query(postData);

    let project = await superagent.get('localhost:8080/project/' + projectId)
      .set('x-access-token', adminUserCreationResp.token);

    project = JSON.stringify(project);
    project = JSON.parse(project);
    console.log('Updated project ', project);


    let removeProject = await superagent.post('localhost:8080/project/' + projectId + '/cards/remove')
      .set('x-access-token', adminUserCreationResp.token)
      .query(postData);


    project = await superagent.get('localhost:8080/project/' + projectId)
      .set('x-access-token', adminUserCreationResp.token);

    project = JSON.stringify(project);
    project = JSON.parse(project);
    console.log('Updated project ', project);
  });

  it('Testing adding ,getting and deleting participants', async () => {

    let projectId = createdProjectInfo._id;
    const postData = {
      projectParticipant: [1345, 23456, 12312, 41234]
    };
    let participantAddingRes = await superagent.post('localhost:8080/project/' + projectId + '/participants/add')
      .set('x-access-token', adminUserCreationResp.token)
      .query(postData);
    participantAddingRes = JSON.stringify(participantAddingRes);
    participantAddingRes = JSON.parse(participantAddingRes);
  //  console.log('ADDDDING PARTICIPANT RES', participantAddingRes);

    let project = await superagent.get('localhost:8080/project/' + projectId)
      .set('x-access-token', adminUserCreationResp.token);

    project = JSON.stringify(project);
    project = JSON.parse(project);
    //console.log('Updatedd project ', project);

    const removeData = {
      projectParticipant: 1345
    };

    let participantRemoveRes = await superagent.post('localhost:8080/project/' + projectId + '/participants/remove')
      .set('x-access-token', adminUserCreationResp.token)
      .query(removeData);


    project = await superagent.get('localhost:8080/project/' + projectId)
      .set('x-access-token', adminUserCreationResp.token);

    project = JSON.stringify(project);
    project = JSON.parse(project);
    console.log('Participant removal result ', project);

    //Get all project participants

    let participants=await superagent.get('localhost:8080/project/'+projectId+'/participants')
                                    .set('x-access-token',adminUserCreationResp.token);
     participants=JSON.stringify(participants);
     participants=JSON.parse(participants);
     console.log(participants);

  });

  it('Add/remove admin from project', async () => {

  });


});
