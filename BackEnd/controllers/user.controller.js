const User=require('../models/user.model.js');

module.exports={
   test:function(req,res){
     res.send('User route works!');
   }
};
