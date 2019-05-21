let userToken = '610e6caf9a643876f09c44d0d1a24fee2f35f507';

process.env.NODE_ENV = 'test';

const app = require('../../Backend/app.js');
const superagent = require('./myagent');
const assert = require('assert');
const userManager = require('../../Backend/manager/user.manager');
const repoManager = require('../../Backend/manager/repo.manager');
const functionalHelper = require('../common/functionalHelper');
const Octokit = require('@octokit/rest');
const DNS = 'localhost:8080';

describe('We should be able to delete a repo', async () => {
  it('Should be able to delete ', async () => {
    const octokit=new Octokit({
      auth:`${userToken}`
    })
    //REPOSD
    const user=await userManager.getUserByUserName('JckXia');
    const URL= deletionUrl = DNS + '/api/github/repo/' +  'REPOSDD'+ '/delete';
    const req =await superagent.post(URL)
    .set({
      id: user.id
    })
    .set({
      user: userToken
    }).then((res)=>{
    //  console.log(res);
    })
 
  });
});
