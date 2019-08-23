const authHelper = require('../util/authenticationHelper');
const Project = require('../models/project.model.js');
const User = require('../models/user.model.js');
const userValidation = require('../util/userValidation');
const projectPermissionHelper = require('../util/projectPermissionHelper');

module.exports = {
  test: function(req, res) {
    res.send('Success');
  },
  /*
    Get a project by pk
    request_type:POST,
    parameters: project pk
    Permission level: project participant and admin of said project only
  */
  get_one_project: async function(req, res) {

    //Only project admin and participants have access to this route

    const userId = await authHelper.getAuthenticatedUserId(req, res);
    if (userId == null) {
      return res.status(403).send('Forbidden access');
    }

    if (await projectPermissionHelper.userIsAdminOfProject(userId, req.params.id) ||
      await projectPermissionHelper.userIsParticipantOfProject(userId, req.params.id)) {

      Project.findById(req.params.id, function(err, project) {
        if (err) {
          throw err;
        }
        //  console.log('PROJECT ',project);
        return res.status(200).send(project);
      });
    } else {
      return res.status(403).send('Forbidden');
    }

  },

  /*
   request_type:GET,
   parameters:none
   Permission level: Both project admin and participant
  */
  get_all_projects: async (req, res) => {
    const userId = authHelper.getAuthenticatedUserId(req, res);
    Project.find({}, function(err, projects) {
      if (err) {
        throw err;
      }
      res.send(projects);
    });
  },

  /*
    Add a user as a project admin
    request_type: POST,
    parameters:projectId, user information?
    Permission level: Project admin of project only
  */
  add_project_admin: async (req, res) => {

    const userId = await authHelper.getAuthenticatedUserId(req, res);
    if (!await projectPermissionHelper.userIsAdminOfProject(userId, req.params.id)) {
      res.status(403).send({
        success: false,
        message: 'Forbidden'
      });
    }

    let id = req.params.id;
    let adminName = req.query.adminName;
    let adminPk = req.query.adminPk;

    Project.updateOne({
      _id: id
    }, {
      project_admin_pk: adminPk,
    }, {
      project_admin_userName: adminName
    }, (err, result) => {
      if (err) {
        throw err;
      }
      res.send(result);
    })
  },

  /*
    Create a project
    request type:POST
    Restrictions:
              1. repo exists? (Front end check)
              2. project admin name agrees with pk?
              3. Project participant pk valid?
  */
  create_project: async (req, res) => {
    const data = req.query;
    const userId = await authHelper.getAuthenticatedUserId(req, res);
    if (!userValidation.validateUserPk(data.projectAdminUserName, data.projectAdminPk)) {
      return res.status(404).send({
        success: false,
        message: 'Used not found!'
      });
    }
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;

    let newProject = new Project({
      repo_name: req.query.repoName,
      repo_owner_name: req.query.repoOwnerName,
      project_admin_pk: req.query.projectAdminPk,
      project_admin_userName: req.query.projectAdminUserName,
      project_creator_name: req.query.projectCreatorName,
      project_creator_pk: req.query.projectCreatorPk,
      project_participants: req.query.projectParticipants,
      project_creation_date: today
    });

    newProject.save((err) => {
      if (err) {
        throw err;
      }
      res.send(newProject);
    })
  },
  /*
    Get call
    call type:GET
    Permission level: Authenticated user
                    both  project participant and admin
  */
  get_project_participants: async (req, res) => {

    const userId = await authHelper.getAuthenticatedUserId(req, res);
    if (userId == null) {
      return res.status(403).send('Forbidden access');
    }
    if (await projectPermissionHelper.userIsAdminOfProject(userId, req.params.id) ||
      await projectPermissionHelper.userIsParticipantOfProject(userId, req.params.id)) {
      let id = req.params.id;
      console.log(id);
      Project.findOne({
        _id: id
      }, function(err, project) {
        if (err) {
          throw err;
        }

        return res.status(200).send(project.project_participants);
      });
    } else {
      return res.status(403).send('Forbidden access');
    }
  },

  /*
    Get call
    Permission level: Authenticated user
                      Both project participant and admin
  */
  get_project_cards: async (req, res) => {
    const userId = await authHelper.getAuthenticatedUserId(req, res);
    if (userId == null) {
      return res.status(403).send('Forbidden access');
    }
    if (await projectPermissionHelper.userIsAdminOfProject(userId, req.params.id) ||
      await projectPermissionHelper.userIsParticipantOfProject(userId, req.params.id)) {
      let id = req.params.id;
      Project.findOne({
        _id: id
      }, function(err, project) {
        if (err) {
          throw err;
        }
        return res.status(200).send(project.project_cards);
      });
    } else {
      return res.status(403).send('Forbidden access');
    }
  },

  /*
    Add a card/task to the project
    Project admin and participant
  */
  add_card_to_project: async (req, res) => {
    const userId = await authHelper.getAuthenticatedUserId(req, res);
    if (userId == null) {
      return res.status(403).send('Forbidden access');
    }

    if (await projectPermissionHelper.userIsAdminOfProject(userId, req.params.id) ||
      await projectPermissionHelper.userIsParticipantOfProject(userId, req.params.id)) {

      let project_id = req.params.id;
      let card_id = req.query.card_id;
      Project.updateOne({
        _id: project_id
      }, {
        $push: {
          project_cards: card_id
        }
      }, (err, updateResult) => {
        if (err) {
          throw err;
        }
        console.log('update', updateResult);
        return res.status(200).send(updateResult)
      });
    } else {
      return res.status(403).send('Forbidden access');
    }
  },

  /*
   Remove a card from project
    Check to see if the card is a card under the project , else throw 403
    Project admin and assignee
  */
  remove_card_from_project: async (req, res) => {
    let project_id = req.params.id;
    let card_id = req.query.card_id;
    const userId = await authHelper.getAuthenticatedUserId(req, res);
    if (userId == null) {
      return res.status(403).send('Forbidden access');
    }

    if (await projectPermissionHelper.userIsAdminOfProject(userId, req.params.id) ||
      await projectPermissionHelper.userIsParticipantOfProject(userId, req.params.id)) {
      if (await projectPermissionHelper.cardIsUnderProject(card_id, project_id)) {
        Project.updateOne({
          _id: project_id
        }, {
          $pull: {
            project_cards: card_id
          }
        }, (err, updateResult) => {
          if (err) {
            return res.status(500).send('SERVER ERROR');
          }
          return res.status(200).send(updateResult)
        });
      } else {
        return res.status(403).send('Forbidden access');
      }
    } else {
      return res.status(403).send('Forbidden access');
    }
  },

  /*
   Add a participant to the project
  */
  add_project_participant: async (req, res) => {
    const userId = await authHelper.getAuthenticatedUserId(req, res);
    if (userId == null) {
      return res.status(403).send('Forbidden');
    }
    if (await projectPermissionHelper.userIsAdminOfProject(userId, req.params.id) ||
      await projectPermissionHelper.userIsParticipantOfProject(userId, req.params.id)) {
      let projectParticipant = req.query.projectParticipant;
      let project_id = req.params.id;
      Project.updateOne({
        _id: project_id
      }, {
        $addToSet: {
          project_participants: projectParticipant
        }
      }, (err, updateResult) => {
        if (err) {
          throw err;
        }
        return res.status(200).send(updateResult);
      });
    } else {
      return res.status(403).send('Forbidden');
    }
  },

  /*
      Remove project participnat from the project
      Route permission level: user admin only
                              Asserts that the participant to be
                              deleted is
  */
  remove_project_participant: async (req, res) => {
    const userId = await authHelper.getAuthenticatedUserId(req, res);
    if (userId == null) {
      return res.status(403).send('Forbidden access');
    }
    if (await projectPermissionHelper.userIsAdminOfProject(userId, req.params.id) ||
      await projectPermissionHelper.userIsParticipantOfProject(userId, req.params.id)) {
      let participant = req.query.projectParticipant;
      let project_id = req.params.id;
      Project.updateOne({
        _id: project_id
      }, {
        $pull: {
          project_participants: participant
        }
      }, (err, updateResult) => {
        if (err) {
          throw err;
        }
        return res.status(200).send(updateResult);
      });
    } else {
      return res.status(403).send('Access forbidden');
    }
  }
}
