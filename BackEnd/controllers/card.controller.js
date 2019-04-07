const Card =require('../models/card.model.js');



module.exports={
  test:function(req,res){
    res.send('Card route works!');
  },
  /*
     Create a card given some data
  */
  create_card:(req,res)=>{
    let newCard=new Card({
      card_state:req.query.card_state,
      toDoItemTitle:req.query.toDoItemTitle,
      toDoItemDetail:req.query.toDoItemDetail,
      assignedTo:req.query.assignees
    }
  )
  newCard.save(function(err){
    if(err){
      throw err;
    }
    res.send(newCard);
  });
 },

//Model.findByIdAndUpdate(id, { name: 'jason bourne' }, options, callback)
//TODO: Add validation to check the data. authentication, etc
 update_card_information:(req,res)=>{
    //req contains card id
    //req contains card field to be updated
    // one of (all) : toDoItem, toDoItemDetail
    let card_id=req.params.id;
    let field_to_be_updated=req.query.field;
  Card.findOneAndUpdate({_id:card_id},{[field_to_be_updated]:req.query.newValue},function(err,model){
      if(err){
        throw err;
      }
    res.send(model);
  });
 },

/*
  request parameter contains: user id
  Effect: Push the user id to an arrayS
*/
add_assignees_to_task:(req,res)=>{
   let user_id=req.query.user_id;
   let card_id=req.params.id;
   Card.update({_id:card_id},{$push:{assignedTo:user_id}},function(err,model){
     if(err){
       throw err;
     }
     res.send(model);
   })
},

 /*
   request paramter contains:user id
   effect: remove this value from assignedTo
 */
 remove_assigness_from_task:(req,res)=>{
   let card_id=req.params.id;
   let user_id=req.query.user_id;
    Card.update({_id:card_id},{$pull:{assignedTo:user_id}},function(err,card){
      if(err){
        throw err;
      }
      res.send(card);
    });
 },

 /*
   request type: GET
   effect: get a card detail by card id
 */
 see_card_item_detail:(req,res)=>{
   let card_id=req.params.id;
   Card.find({_id:card_id},function(err,model){
      if(err){
        throw err;
      }
      res.send(model);
   });
 }
}
