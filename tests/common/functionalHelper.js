const superagent = require('superagent');

async function createUser(userName, passWord) {
  const userCreationResponse = await superagent.post('localhost:8080/auth/local/register')
    .query({
      username: userName,
      password: passWord
    });
  let responseStr = JSON.stringify(userCreationResponse);
  responseStr = JSON.parse(responseStr);

  let user= responseStr.text;
  user = JSON.parse(user);
  return user;
}

async function createProject(userAccessToken){
  const postBody={
    repoName:'gitDemo',
    repoOwnerName:'JckXia'
  };
  const projectCreationResponse=await superagent.post('localhost:8080/project/create');
}

module.exports = {
  createUser
};
