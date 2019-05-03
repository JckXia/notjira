process.env.NODE_ENV = 'test';

const app = require('../../Backend/app.js');
const superagent = require('superagent');
const assert = require('assert');
const functionalHelper = require('../common/functionalHelper');
const DNS = 'localhost:8080';
describe('Test webhook creations ', async function(){
  this.timeout(500000);
  it('Should be able to create a webhook and listen to events', async () => {
      const reqUrl=DNS+'/api/github/JckXia/gitDemo/webhook/create';
      const postData={
        proxyurl:'https://smee.io/At0G3RleQbMLBz3u'
      };
    const res=await superagent.post(reqUrl)
                              .send(postData);
    console.log(res.status);
  //  console.log(res);
  });

});
