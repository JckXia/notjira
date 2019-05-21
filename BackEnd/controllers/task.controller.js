const Task = require('../models/task.model.js');
const authHelper = require('../util/authenticationHelper');
const projectPermissionHelper = require('../util/projectPermissionHelper')
const repoManager=require('../manager/repo.manager');
const authTypes = require('../util/constants/authenticationType');


module.exports={

  updateTaskInformation:async(req,res)=>{
    const userId = await authHelper.getAuthenticatedUserId(req, res);
    if (userId == null) {
      return res.status(403).send('Forbidden');
    }
    if(await repoManager.userIsAdminOfRepo(userId,req.params.repoName)){
      let field_to_be_updated=req.params.field;
      if (field_to_be_updated != 'taskTitle' && field_to_be_updated != 'taskDetail') {
        return res.status(404).send('Illegal arguments!');
      }
      if(field_to_be_updated == 'toDoItem'){
        let newValue=req.body.newValue;
        if (newValue != 'Done' && newValue != 'inProg' && newValue != 'toDo') {
          return res.status(400).send('Illegal arguments!');
        }
      }
      Task.findOneAndUpdate({
        _id:req.params.id
      },{
        [field_to_be_updated]:req.query.newValue
      },(err,model)=>{
        if(err){
          throw err;
        }
        return res.status(200).send(model);
      });
    }else{
      return res.status(403).send('Forbidden!');
    }
  },
  updateCardState:async(req,res)=>{
      const userId = await authHelper.getAuthenticatedUserId(req, res);
      if(userId == null){
          return res.status(403).send('Forbidden');
      }
      if(await repoManager.userIsAdminOfRepo(userId,req.params.repoName)){
          let field_to_be_updated='task_state';
          let newValue=req.body.newValue;
          if (newValue != 'Done' && newValue != 'inProg' && newValue != 'toDo') {
            return res.status(400).send('Illegal arguments!');
          }
          Task.findOneAndUpdate({
            _id:req.params.id
          },{
            [field_to_be_updated]:req.query.newValue
          },(err,model)=>{
            if(err){
              throw err;
            }
            return res.status(200).send(model);
          })
      }else{
          return res.status(403).send('Forbidden!');
      }
  }
};
