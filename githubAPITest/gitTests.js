const express = require('express');
const app = express();
const passport = require('passport');

const Octokit = require('@octokit/rest');
const keys = require('../config/keys');
const superagent=require('superagent');

let userToken ='';
//7e6e8c9aba6706834bcfb2c8b7807820fc2d6a605cbb42f40f35c92424e43a9e
let masterHash = 'b5aa826799211bdf5c0f6a0bf620531abe929c6c';


const newOctokit=new Octokit({
  auth:{
    username:'JckXia',
    password:'14050079xJ'
  }
});

const AuthData={
  client_id:keys.clientId,
  client_secret:keys.clientSecret,
  redirect_uri:'localhost:8080/auth/github/callback',
  scope:['repo',"write:org"],
}







console.log(keys);
