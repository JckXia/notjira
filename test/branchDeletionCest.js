const taskId='5d696960b3fd2ef0ec26a330';
const repoId='5d686f4e35f6c6a4c4fd93ae';
const keys = require('../config/keys');
process.env.NODE_ENV='test';
const app=require('../index.js');
const DNS='localhost:8080';
process.env.NODE_ENV='test';
const request=require('superagent');
const Octokit=require('@octokit/rest');
let masterBranchRef='';
let branches=[];
describe('Test running', async()=>{
  //   console.log(keys);
     before(async()=>{
       const reqUrl=DNS+'/api/task/gitTestingRepo/delete_task';
       const reqData={
          taskId,
          repoId
       };
       const result=await request.post(reqUrl).send(reqData);
       //api/task/:repoName/create_task
      //  console.log(result);
     });
    it('Should be able to create references',async()=>{

    });

    after(async()=>{
      console.log('Finished');
    });

});
