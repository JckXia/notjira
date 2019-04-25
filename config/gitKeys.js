//keys.js needs to figure out what set of credentials to return
if(process.env.NODE_ENV == 'production'){
 //We are in production, return prod keys
 module.exports=require('./prod');
}else{
 //We are in development, return dev keys
 module.exports=require('./accessToken');
}
