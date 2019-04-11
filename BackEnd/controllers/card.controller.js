const Card = require('../models/card.model.js');
const authHelper = require('../util/authenticationHelper');
const projectPermissionHelper = require('../util/projectPermissionHelper')
const authTypes = require('../util/constants/authenticationType');
module.exports = {

  //Getting all cards
  testGetAllCard: function(req, res) {
    authHelper.isAuthenticated(req, res);
    const authType = authHelper.authenticationMethod(req);
    console.log(authType);
    switch (authType) {
      case authTypes.GITHUB_SSO:


        break;

      case authTypes.LOCAL_AUTH:


        break;
    }

    Card.find({}, (err, cards) => {
      if (err) {
        throw err;
      }
      res.send(cards);
    })
  },

  /*
     Create a card given some data
     Only admin and participant of a project has the ability to create project cards
  */
  create_card: async (req, res) => {
  //    const k=authHelper.getLocalAuthUserInformation('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjYWEwZTA3MWI2NDdjMjZmNDU2ZmE1OCIsImlhdCI6MTU1NDk0NzM4NiwiZXhwIjoxNTU1MDMzNzg2fQ.23rry4W6vpHWbfcNRFM5qYLqARBB1fDhqxGTqMyPvi4');
    if (!authHelper.isAuthenticated(req, res)) {
      return res.status(403).redirect('/login');
    }
    const authType=authHelper.authenticationMethod(req);
    let userId=null;
    switch(authType){
      case authTypes.GITHUB_SSO:
        userId=req.user.id;
      break;

      case authTypes.LOCAL_AUTH:
      userId=await authHelper.getLocalAuthUserId(req);
      break;
    }
   // 5caa97fe8cc5ea5cc8418472'
    if (await projectPermissionHelper.userIsAdminOfProject(userId, req.query.project_id) &&
      await projectPermissionHelper.userIsParticipantOfProject(userId,req.query.project_id)) {

      let newCard=new Card({
        card_state: req.query.card_state,
        toDoItemTitle: req.query.toDoItemTitle,
        toDoItemDetail: req.query.toDoItemDetail,
        assignedTo: req.query.assignees,
        isGitTask: req.query.gitTask
      });

      newCard.save((err)=>{
        if(err){
          throw err;
        }
        res.send(newCard);
      });
    }
  },

  //Model.findByIdAndUpdate(id, { name: 'jason bourne' }, options, callback)
  //TODO: Add validation to check the data. authentication, etc
  //req contains card id
  //req contains card field to be updated
  // one of (all) : toDoItem, toDoItemDetail
  update_card_information: (req, res) => {
    let card_id = req.params.id;
    let field_to_be_updated = req.params.field;
    Card.findOneAndUpdate({
      _id: card_id
    }, {
      [field_to_be_updated]: req.query.newValue
    }, function(err, model) {
      if (err) {
        throw err;
      }
      res.send(model);
    });
  },

  /*
    request parameter contains: user id
    Effect: Push the user id to an arrayS
  */
  add_assignees_to_task: (req, res) => {
    let user_id = req.query.user_id;
    let card_id = req.params.id;
    Card.update({
      _id: card_id
    }, {
      $push: {
        assignedTo: user_id
      }
    }, function(err, model) {
      if (err) {
        throw err;
      }
      res.send(model);
    })
  },

  /*
    request paramter contains:user id
    effect: remove this value from assignedTo
  */
  remove_assigness_from_task: (req, res) => {
    let card_id = req.params.id;
    let user_id = req.query.user_id;
    Card.update({
      _id: card_id
    }, {
      $pull: {
        assignedTo: user_id
      }
    }, function(err, card) {
      if (err) {
        throw err;
      }
      res.send(card);
    });
  },

  /*
    request type: GET
    effect: get a card detail by card id
  */
  see_card_item_detail: (req, res) => {
    let card_id = req.params.id;
    Card.find({
      _id: card_id
    }, function(err, model) {
      if (err) {
        throw err;
      }
      res.send(model);
    });
  },

  /*
    request type:POST
    effect:adding a git branch
  */
  addBranchToCard: (req, res) => {
    let card_id = req.params.id;
    let gitBranch = req.query.gitBranch;
    Card.updateOne({
      _id: card_id
    }, {
      $push: {
        taskBranches: gitBranch
      }
    }, function(err, updateResult) {
      if (err) {
        throw err;
      }
      res.send(updateResult);
    })
  },

  /*
   Removes a branch from the card information
  */
  removeBranchFromCard: (req, res) => {
    let card_id = req.params.id;
    let gitBranch = req.query.gitBranch;
    Card.updateOne({
      _id: card_id
    }, {
      $pull: {
        taskBranches: gitBranch
      }
    }, function(err, updateResult) {
      if (err) {
        throw err;
      }
      res.send(updateResult);
    })
  }
}
