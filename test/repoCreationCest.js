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
       const reqUrl=DNS+'/api/github/gitTestingRepo/branch';
       const reqData={
         owner:'JckXiaDevelopAcct',
         repo:'gitTestingRepo'
       };
 const result=await request.get(reqUrl).send(reqData);
 console.log('RESULT ',result.body.data[0].object.sha);
 masterBranchRef=result.body.data[0].object.sha;
 branches=result.body.data;

     //  console.log('RESULT');
     });
    it('Should be able to create references',async()=>{
      console.log(branches);
      const childBranch=branches[0];
      const accessToken=keys.userAccessToken;
      const octokit=new Octokit({
        auth:`${accessToken}`
      });

     let ref=childBranch.ref.replace('refs/','');
     console.log(ref);
/*
      const result=await octokit.git.deleteRef({
        owner:'JckXiaDevelopAcct',
        repo:'gitTestingRepo',
        ref:'heads/test'
      });
*/
        //Running at test environment
    });

    after(async()=>{
      console.log('Finished');
    });

});
