const proxy=require('http-proxy-middleware');

module.exports=function(app){
  app.use(proxy('/auth/github/*',{
    target:'http://localhost:8080'
  }));

  app.use(proxy('/api/github',{
    target:'http://localhost:8080'
  }));
};
