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
       const reqUrl=DNS+'/api/task/gitTestingRepo/create_task';
       const reqData={
          taskTitle:'TestTitle',
          taskDesc:'Lorem lotel',
       };
       const result=await request.post(reqUrl).send(reqData);
       //api/task/:repoName/create_task

     });
    it('Should be able to create references',async()=>{

    });

    after(async()=>{
      console.log('Finished');
    });

});
