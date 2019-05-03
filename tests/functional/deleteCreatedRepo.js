
process.env.NODE_ENV = 'test';

const app = require('../../Backend/app.js');
const superagent = require('./myagent');
const assert = require('assert');
const userManager = require('../../Backend/manager/user.manager');
const repoManager = require('../../Backend/manager/repo.manager');
const functionalHelper = require('../common/functionalHelper');
const token=require('../../config/userTokenForTesting.js');
const DNS = 'localhost:8080';
const Octokit = require('@octokit/rest');
let userToken=token.access_token;

describe('delete it', function () {
    it('Should be deleting extra shit',async()=>{
        const octokit=new Octokit({
            auth:{
                username:'JckXia',
                password:'14050079xJ'
            }
        });

         let repos=await octokit.repos.list();

         repos=repos.data;

         const len=repos.length;

        for(let i=0;i<len;i++){

            if(repos[i].name.includes('OctokitCreationRepos')){
                console.log(repos[i].name);


               await octokit.repos.delete({
                   owner:'JckXia',
                   repo:repos[i].name
                });


            }
        }
        /*
        octokit.repos.delete({
            owner:'JckXia',
            repo:'REPOSDDD'
        })
        */

    });
});