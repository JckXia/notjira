process.env.NODE_ENV = 'test';

const app = require('../../Backend/app.js');
const superagent = require('superagent');
const assert = require('assert');
const functionalHelper = require('../common/functionalHelper');
describe('contact ', function() {
  let userName = null;
  let userCreationResp = null;
  let projectData = null;
  let cardInfo = null;
  before(async () => {
    //Here, we want to create a user
    //We want to create a project. The user is the admin of project
    userName = 'UserName ' + Math.random();
    userCreationResp = await functionalHelper.createUser(userName, '12345');
    const queryData = {
      repoName: 'gitDemo',
      repoOwnerName: 'JckXia',
      projectAdminPk: userCreationResp.id,
      projectAdminUserName: userName,
      projectCreatorName: userName,
      projectCreatorPk: userCreationResp.id,
      projectParticipants: []
    };

    let projectCreationResp = await superagent.post('localhost:8080/project/create')
      .set('x-access-token', userCreationResp.token)
      .query(queryData);
    projectCreationResp = JSON.stringify(projectCreationResp);
    projectCreationResp = JSON.parse(projectCreationResp);
    projectData = JSON.parse(projectCreationResp.text);


  });
  it('Should be able to create a card', async () => {
    const cardCreationData = {
      project_id: projectData._id,
      card_state: 'toDo',
      toDoItemTitle: 'Hi im brand',
      toDoItemDetail: '1231',
      assignedTo: [],
      isGitTask: true
    };

    let cardCreationResp = await superagent.post('localhost:8080/card/create')
      .set('x-access-token', userCreationResp.token)
      .query(cardCreationData);
    cardCreationResp = JSON.stringify(cardCreationResp);
    cardCreationResp = JSON.parse(cardCreationResp);
    cardInfo = JSON.parse(cardCreationResp.text);
    console.log(cardInfo);
  });
  it('Should be able to update card information', async () => {
    const cardUpdateData = {
      newValue: 'JACKXIA',
      project_id: projectData._id
    };

    let cardUpdateRes = await superagent.post('localhost:8080/card/update/toDoItemTitle/' + cardInfo._id)
      .set('x-access-token', userCreationResp.token)
      .query(cardUpdateData);
    cardUpdateRes = JSON.stringify(cardUpdateRes);
    cardUpdateRes = JSON.parse(cardUpdateRes);
    console.log(cardUpdateRes);
  });

  it('Should be able to see card item in detail', async () => {
    const queryData={
      project_id:projectData._id
    };
    let cardSearchRes=await superagent.get('localhost:8080/card/'+cardInfo._id)
                                      .set('x-access-token',userCreationResp.token)
                                      .query(queryData);
     cardSearchRes=JSON.stringify(cardSearchRes);
     cardSearchRes=JSON.parse(cardSearchRes);
     console.log(cardSearchRes);
  });

  it('Should update the state of a given card',async()=>{
      const cardStateChangeData={
        newValue:'Done',
        project_id:projectData._id
      };
      let cardStateChangeRes=await superagent.post('localhost:8080/card/update/state/card_state/'+cardInfo._id)
                                             .set('x-access-token',userCreationResp.token)
                                             .query(cardStateChangeData);
      cardStateChangeRes=JSON.stringify(cardStateChangeRes);
      cardStateChangeRes=JSON.parse(cardStateChangeRes);
    //  console.log(cardStateChangeRes);


      const queryData={
        project_id:projectData._id
      };
      let cardSearchRes=await superagent.get('localhost:8080/card/'+cardInfo._id)
                                        .set('x-access-token',userCreationResp.token)
                                        .query(queryData);
       cardSearchRes=JSON.stringify(cardSearchRes);
       cardSearchRes=JSON.parse(cardSearchRes);
       console.log(cardSearchRes);
  });

  it('should let users add assignees to task', async () => {

    // 5caa97fe8cc5ea5cc8418472'
      const assigneePostData={
        newAssigneeId:'12345',
        project_id:projectData._id
      };

      let addAssigneeRes=await superagent.post('localhost:8080/card/add_assignee/'+cardInfo._id)
                                          .set('x-access-token',userCreationResp.token)
                                          .query(assigneePostData);
      addAssigneeRes=JSON.stringify(addAssigneeRes);
      addAssigneeRes=JSON.parse(addAssigneeRes);
      console.log(addAssigneeRes);
  });

  it('should be able to remove assignees from task', async () => {
 
  });



  it('Should be able to add branch to card', async () => {

  });

  it('Should be able to remove branch from card', async () => {

  });
});
