const express = require('express');
const app = express();
const passport = require('passport');

const Octokit = require('@octokit/rest');
const keys = require('../config/keys');
let token = '1346a51369b4fb13841cf0c10ed748460d2a5a13';
//7e6e8c9aba6706834bcfb2c8b7807820fc2d6a605cbb42f40f35c92424e43a9e
let masterHash = 'b5aa826799211bdf5c0f6a0bf620531abe929c6c';


let newOctokit = new Octokit({
    auth:`${token}`
});

const branchName = 'refs/heads/vue' + Math.random();

/*
newO ctokit.git.createRef({
  owner: 'JckXia',
  repo: 'gitDemo',
  ref: branchName,
  sha: masterHash
}).then((data) => {
  console.log('data ', data);
});
*/

/*
newOctokit.projects.createForAuthenticatedUser({
  name:'TestingRepo'
}).then((data)=>{
  console.log(data);
})
*/
newOctokit.repos.createForAuthenticatedUser({
  name:'OctokitCreationRepos'+Math.random()
}).then((data)=>{
  console.log(data);
})
/*
    let masterHash = 'b5aa826799211bdf5c0f6a0bf620531abe929c6c';
    console.log('ACCESS_TOKEN', accessToken);
    const octokit = new Octokit({
      auth: `bearer ${accessToken}`
    });
    const branchName = 'refs/head/vue' + Math.random();
    /*
    octokit.git.createRef({
      owner:'JckXia',
      repo:'gitDemo',
      ref:branchName,
      sha:masterHash
    }).then((data)=>{
    //  console.log(data);
    }).catch((e)=>{
      //console.log(e.headers);

    })
    */

/*
let octokit=new Octokit({
  auth:{
    username:'JcKXia',
    password:'14050079xJ'
  }
});


 const branchName='refs/heads/vue'+Math.random();


 octokit.git.createRef({
   owner:'JckXia',
   repo:'gitDemo',
   ref:branchName,
   sha:masterHash
 }).then((data)=>{
   console.log('data ',data);
 });
*/


//app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/github', passport.authenticate('github'), function(req, res) {});
app.get('/auth/github/callback', passport.authenticate('github'), (req, res) => {
  res.redirect('/');
});




app.listen(3000, () => {
  console.log('App up and running on port 3000');
});
