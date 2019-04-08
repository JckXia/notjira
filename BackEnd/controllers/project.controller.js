const Project = require('../models/project.model.js');
const User = require('../models/user.model.js');

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
  get_one_project: function(req, res) {
    Project.findById(req.params.id, function(err, project) {
      if (err) {
        throw err;
      }
      res.send(project);
    });
  },

  /*
   request_type:GET,
   parameters:none
   Permission level: Project admins only
  */
  get_all_projects: (req, res) => {
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
  add_project_admin: (req, res) => {
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

  create_project: (req, res) => {

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
      project_participants: req.query.projectParticipants,
      project_creation_date: today
    });

    newProject.save((err)=>{
      if(err){
        throw err;
      }
      res.send(newProject);
    })
  },
  get_project_participants:(req,res)=>{
      let id=req.params.id;
      Project.findOne({_id:id},function(err,project){
          if(err){
            throw err;
          }
          res.send(project.project_participants);
      });
  },
  get_project_cards:(req,res)=>{
     let id=req.params.id;
     Project.findOne({_id:id},function(err,project){
         if(err){
           throw err;
         }
         res.send(project.project_cards);
     });
  },
  add_card_to_project:(req,res)=>{
    let project_id=req.params.id;
    let card_id=req.query.card_id;
    Project.updateOne({
      _id:project_id
    },{
      $push:{
        project_cards:card_id
      }
    },(err,updateResult)=>{
       if(err){
         throw err;
       }
       res.status(200).send(updateResult)
    });
  },
  remove_card_from_project:(req,res)=>{
    let project_id=req.params.id;
    let card_id=req.query.card_id;
    Project.updateOne({
      _id:project_id
    },{
      $pull:{
        project_cards:card_id
      }
    },(err,updateResult)=>{
       if(err){
         throw err;
       }
       res.status(200).send(updateResult)
    });
  },
  add_project_participant:(req,res)=>{
     let projectParticipant=req.query.projectParticipant;
     let project_id=req.params.id;
     Project.updateOne({
       _id:project_id
     },{
       $addToSet:{
         project_participants:projectParticipant
       }
     },(err,updateResult)=>{
        if(err){
          throw err;
        }
        res.status(200).send(updateResult);
     });
  },
  remove_project_participant:(req,res)=>{

    let participant=req.query.projectParticipant;
    let project_id=req.params.id;
    Project.updateOne({
      _id:project_id
    },{
      $pull:{
        project_participants:participant
      }
    },(err,updateResult)=>{
       if(err){
         throw err;
       }
       res.status(200).send(updateResult);
    });
  }
}
