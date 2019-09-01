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
       const reqUrl=DNS+'/api/repo/gitTestingRepo';
       const reqData={
            reqUrl
       };
       const result=await request.get(reqUrl);
       //api/task/:repoName/create_task

     });
     it('Exec',async()=>{
       console.log('Executing!');
     });

});
