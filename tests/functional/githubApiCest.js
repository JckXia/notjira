

process.env.NODE_ENV = 'test';

const app = require('../../Backend/app.js');
const superagent = require('./myagent');
const assert = require('assert');
const userManager = require('../../Backend/manager/user.manager');
const repoManager = require('../../Backend/manager/repo.manager');
const functionalHelper = require('../common/functionalHelper');
const token=require('../../config/userTokenForTesting.js');
const DNS = 'localhost:8080';
let userToken=token.access_token;
describe('Github API routes', async () => {

  it('Unauthenticated users should not be able to create a repository', async () => {
      const reqUrl = DNS + '/api/github/repo/create';
      const postData = {
        repoName: 'TESTDATA_GITHUB_CREATIONS_DKS'
      };

      const response = await superagent.post(reqUrl)
        .set({
          user: userToken
        })
        .send(postData)
        .end((err, res) => {
          assert(res.status == 403);
        })
    }),

    it('Authenticated users should be able to create and delete repository', async () => {
      const reqUrl = DNS + '/api/github/repo/create';
      const postData = {
        repoName: 'PAS'+Math.random(1,20),
        proxyurl:'https://smee.io/At0G3RleQbMLBz3u'
      };

      const user = await userManager.getUserByUserName('JckXia');
      userToken = user.token;

      const repoCreationResp = await superagent.post(reqUrl)
        .set({
          id: user.id
        })
        .set({
          user: userToken
        })
        .send(postData)
        .then((res)=>{
          if(res.status != 201){
            throw 'Error! Unsuccessful creation'
          }
        });

       /*
        const URL= DNS + '/api/github/repo/' +postData.repoName+ '/delete';
        const req =await superagent.post(URL)
        .set({
          id: user.id
        })
        .set({
          user: userToken
        }).then((res)=>{
          if(res.status!=200){
            throw `Error! ${res.status} Unsuccessful deletion`;
          }
        })
        */
    }),
    it('Should deny create branch request for unauthenticated users', async () => {

      const reqUrl = DNS + '/api/github/gitDemo/task/create_branch';

      const Data = {
        taskName: 'testTask',
        oldBranchHashVal: '12345'
      };
      const result = await superagent.post(reqUrl)
        .send(Data)
        .end((err, res) => {
          if (err) {
            assert(err.status == 403);
          }
        });
    });


});
