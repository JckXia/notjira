const Project=require('../models/project.model.js');
const User=require('../models/user.model.js');

module.exports = {
    test: function(req,res) {
      res.send('Success');
    },
    /*
      Get a project by pk
      request_type:POST,
      parameters: project pk
      Permission level: project participant and admin of said project only
    */
    get_one_project:function(req,res){
         Project.findById(req.params.id,function(err,project){
             if(err){
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
    get_all_projects:(req,res)=>{
      Project.find({},function(err,projects){
         if(err){
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
    add_project_admin:(req,res)=>{
     // TODO: Make sure the request comes from admin of the project
     // We first make sure that the user exists validation on pk
     // We then update current project field with
    },

    /*
       Delete all project admins
       request_type:POST
       parameter:projectId
       permission level:
    */
    remove_all_project_admins:(req,res)=>{
      
    },

    /*
       request_type:POST
       parameter:projectId,userId
       permission
    */
    remove_project_admin:(req,res)=>{

    },

    /*
        request_type:GET
        paramter:projectId
        permission: Project participant and admin
    */
    get_project_admins:(req,res)=>{

    },

    /*
       request_type:POST
       paramter:projectId, itemId
       permission:Project admin and project participant
    */
    add_to_do_Item_to_project:(req,res)=>{

    },

    /*
      request_type:GET ,
      paramter:projectId
      permission:project participant
    */
    get_to_do_items_from_project:(req,res)=>{

    },
    /*
      request_type:POST
      paramter:projectId, itemId
      permission level: project admin and project participant
    */
    remove_to_do_item_from_project:(req,res)=>{

    },

    /*
        request_type:POST
        paramter:projectId
        permission level:project admin only
    */
    remove_all_to_do_items_from_project:(req,res)=>{

    },

    /*
        request_type:POST
        parameter: projectId
        permission level: project admin only
    */
    delete_project:(req,res)=>{

    }
}
