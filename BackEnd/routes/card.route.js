const express=require('express');
const router=express.Router();
const card_controller=require('../controllers/card.controller.js');

router.get('/testGetAll',card_controller.testGetAllCard);
router.post('/create',card_controller.create_card);

router.post('/update/:field/:id',card_controller.update_card_information);
router.post('/add_assignee/:id',card_controller.add_assignees_to_task);
router.post('/remove_assignee/:id',card_controller.remove_assigness_from_task);
router.get('/:id',card_controller.see_card_item_detail);
router.post('/addBranch/:id',card_controller.addBranchToCard);
router.post('/update/state/card_state/:id',card_controller.updateCardState);
router.post('/removeBranch/:id',card_controller.removeBranchFromCard);
module.exports=router;
