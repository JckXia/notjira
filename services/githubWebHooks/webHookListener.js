const EventSource=require('eventsource');
const WebHooksApi=require('@octokit/webhooks');
module.exports=function(proxyUrl){

  const source=new EventSource(proxyUrl);
  const webhooks = new WebHooksApi({
    secret: 'mysecret'
  });
  source.onmessage = async (event) => {
      const webHookEvent = JSON.parse(event.data);
      const webHookEventName = webHookEvent['x-github-event'];
      //console.log(webHookEvent['x-github-event']);

  await webhooks.verifyAndReceive({
        id: webHookEvent['x-request-id'],
        name: webHookEvent['x-github-event'],
        signature: webHookEvent['x-hub-signature'],
        payload: webHookEvent.body
      });

      if(webHookEventName == 'pull_request'){
          const payload=webHookEvent.body;
      }
    console.log(webHookEventName);

    }
}
