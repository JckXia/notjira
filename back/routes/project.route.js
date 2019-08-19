const express=require('express');
const router=express.Router();
const project_controller=require('../controllers/project.controller.js');
const authenticationHelper=require('../util/authenticationHelper');

//Basic project information routes ---------------------------------- //
router.get('/test',authenticationHelper.isAuthenticated,project_controller.test);
router.get('/',project_controller.get_all_projects);
router.post('/create',project_controller.create_project);
router.get('/:id',project_controller.get_one_project);
// --------------------------------------------------------------------//

//Project admin routes ------------------------------------------- //
router.post('/:id/admin/add',project_controller.add_project_admin);
router.post('/:id/admin/update',project_controller.add_project_admin);
//----------------------------------------------------------------- //


//Project participant routes ------------------------------------------- //
router.get('/:id/participants',project_controller.get_project_participants);
router.post('/:id/participants/add',project_controller.add_project_participant);
router.post('/:id/participants/remove',project_controller.remove_project_participant);
// ---------------------------------------------------------------------//


//Project card routes --------------------------------------------------- //
router.get('/:id/cards',project_controller.get_project_cards);
router.post('/:id/cards/add',project_controller.add_card_to_project);
router.post('/:id/cards/remove',project_controller.remove_card_from_project);
// -----------------------------------------------------------------------//


module.exports=router;
