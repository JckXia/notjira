const Project = require('../models/project.model');


async function userIsAdminOfProject(user_id, project_id) {
  const project=await Project.findOne({_id:project_id});

  if(project){
    if(project.project_admin_pk==user_id){
        return true;
    }
  }
  return false;
}

async function userIsParticipantOfProject(user_id, project_id)  {
    const project=await Project.findOne({_id:project_id});
    if(project){
       console.log(project);
       if(project.project_participants.includes(user_id)){
         return true;
       }
    }
    return false;
}

async function cardIsUnderProject(card_id,project_id){
  const project=await Project.findOne({_id:project_id});
  if(project){
    const cards=project.project_cards;
     if(tasks){
        cards.foreach((card)=>{
          if(card === card_id){
            return true;
          }
        });
     }
  }
  return false;
}
module.exports = {
  userIsAdminOfProject,
  userIsParticipantOfProject
};
