function randomIntFromInterval(min, max) // min and max included
{
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const authenticationManager = require('../manager/authentication.manager');
const projectManager = require('../manager/project.manager');
const repoManager = require('../manager/repo.manager');
const userManager = require('../manager/user.manager');
const Octokit = require('@octokit/rest');

module.exports = {

  //Create a repository
  createRepo: async (req, res) => {


    const Env = process.env.NODE_ENV;

    const userId = Env == 'test' ? req.headers.id : await authenticationManager.getAuthenticatedUserId(req, res);

    if (userId == null) {
      return res.status(403).send('Forbidden! User not authenticated');
    }
    const authToken = Env == 'test' ? req.headers.user : req.user.token;

    const octokit = new Octokit({
      auth: `${authToken}`
    });
    const repoName = req.body.repoName;
    try {
      const repoCreationResp = await octokit.repos.createForAuthenticatedUser({
        name: repoName
      });

      const user = await userManager.getUserById(userId);

      const newRepo = await repoManager.saveNewRepoToDataBase(repoName, user.username, user.id, [], []);

      await userManager.addRepoToUserProfile(newRepo.id, newRepo.repo_name, user.username);

      return res.status(201).send(newRepo);
    } catch (e) {

      return res.status(e.status).send('Error! ' + e);
    }

  },
  deleteRepo: async (req, res) => {

    //We need to check for the permission level
    //If user is creator of the repo, delete
    //else, return 403 forbidden
    //When repo is deleted
    // -Delete repo from db
    // -Delete repo from user list
    // -Delete user cards
    const Env = process.env.NODE_ENV;
    const userId = Env == 'test' ? req.headers.id : await authenticationManager.getAuthenticatedUserId(req, res);

    if (userId == null) {
      return res.status(403).send('Forbidden');
    }
    if (await repoManager.userIsAdminOfRepo(userId, req.params.repoName)) {

      const authToken = Env == 'test' ? req.headers.user : req.user.token;
      const octokit = new Octokit({
        auth: `${authToken}`
      });
      const repo = await repoManager.getRepoByName(req.params.repoName);

      const repoDeletion = await octokit.repos.delete({
        owner: repo.repo_creator_name,
        repo: repo.repo_name
      });

      //Remove repo from databse
      const removeRepoFromDb=await repoManager.deleteRepoFromDataBase(repo.id);

      // TODO:Add a way to delete the cards
      const removeRepoFromUserProfile=await userManager.removeRepoFromUserProfile(repo.id,repo.repo_name,repo.repo_creator_name);

      //Remove this repo from the user's id
      return res.status(200).send('Good');
    } else {
      return res.status(403).send('Forbidden');
    }


  },
  // api/github/:repoName/:taskName/create_branch
  //Send the branch we are branching off of in the body
  //     the name of the new branch in the body as well
  createBranch: async (req, res) => {

    const userId = await authenticationManager.getAuthenticatedUserId(req, res);

    if (userId == null) {
      return res.status(403).send('Forbidden');
    }

    if (await repoManager.userIsAdminOfRepo(userId, req.params.repoName) ||
      await repoManager.userIsCollaboratorOfRepo(userId, req.params.repoName)) {
      let platNumber = randomIntFromInterval(1000, 9999);
      const branchName = 'refs/head/feature-' + platNumber + req.body.taskName;
      const newOctokit = new Octokit({
        auth: `${req.user.token}`
      });
      const repoId = repoManager.getRepoId(req.params.repoName);
      const adminInfo = repoManager.getRepoAdminInfo(repoId);

      newOctokit.git.createRef({
        owner: adminInfo.repo_admin_userName,
        repo: req.params.repoName,
        ref: branchName,
        sha: req.body.oldBranchHashVal
      }).then((data) => {
        res.status(200).send(data);
      });

    } else {
      return res.status(403).send('Forbidden');
    }
  },
  getPullRequests: async (req, res) => {
    await authHelper.getAuthenticatedUserId(req, res);
    const repo_owner_name = req.query.repo_owner_name;
    const repo_name = req.query.repo_name;
    const reqUrl = "https://api.github.com/repos/" + repo_owner_name + "/" + repo_name + "/pulls";
    console.log(reqUrl);
    var options = {
      url: reqUrl,
      headers: {
        'User-Agent': 'request'
      }
    }
    request(options, (err, response, body) => {
      if (err) {
        throw err;
      }
      res.send(body);
    });
  }
}
