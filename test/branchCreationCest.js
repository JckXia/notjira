const keys = require('../config/keys');
process.env.NODE_ENV='test';
const app=require('../index.js');
const DNS='localhost:8080';
process.env.NODE_ENV='test';
const request=require('superagent');
const Octokit=require('@octokit/rest');
let masterBranchRef='';
let branches=[];

describe('Run Cest',async()=>{
  it('Should be able to add to DB',async()=>{
    const reqUrl=DNS+'/api/github/gitTestingRepo/task/create_branch';
    const data={
      taskId:'5d6966a17473091509f97a64',
      branchData:{branchName:'ref/head/stuff',branchHash:'8e11925c246ecbe407ef9489a39e6b6652a4699b'},
      refBranchData:{branchName:'ref/head/master',branchHash:'8e11925c246ecbe407ef9489a39e6b6652a4699b'},
      gitBranchData:{}
    };
    const result= await request.post(reqUrl).send(data);
    console.log(result);
  });


});
