const Card = require('../models/card.model.js');



module.exports = {

  //Getting all cards
  testGetAllCard: function(req, res) {
    Card.find({}, (err, cards) => {
      if (err) {
        throw err;
      }
      res.send(cards);
    })
  },

  /*
     Create a card given some data
  */
  create_card: (req, res) => {
    let newCard = new Card({
      card_state: req.query.card_state,
      toDoItemTitle: req.query.toDoItemTitle,
      toDoItemDetail: req.query.toDoItemDetail,
      assignedTo: req.query.assignees,
      isGitTask: req.query.gitTask
    });
    newCard.save(function(err) {
      if (err) {
        throw err;
      }
      res.send(newCard);
    });
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
    let card_id=  req.params.id;
    let gitBranch=req.query.gitBranch;
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
  removeBranchFromCard:(req,res)=>{
    let card_id=  req.params.id;
    let gitBranch=req.query.gitBranch;
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
