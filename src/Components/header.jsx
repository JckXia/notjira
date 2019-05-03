import React, {Component} from 'react';
import SuperAgent from 'superagent';

class Header extends Component{

  testMakingAPICall=()=>{

    /*  Check login status
    SuperAgent.post('/auth/github/checkUserStatus')
               .then((res)=>{
                console.log(res);
               });
    */
    //Test making calls to all github APIs, expect correct results.
    //Test the following:
    // /api/github/:repoName/task/create_branch

    //  /api/github/repo/create

  /*
      const Data={
        repoName:'TestingApiCallSsX',
        proxyUrl:'https://smee.io/n2Zw6JWuJuWsf2gu'
      };
      SuperAgent.post('/api/github/repo/create')
                .send(Data)
                .then((res)=>{
                  console.log(res);
                });
*/
   // '/api/github/repo/:repoName/delete'

   /*
      SuperAgent.post('/api/github/repo/TestingApiCallSsX/delete')
                .then((res)=>{
                  console.log(res);
                })
    */
    //'/api/github/:ownerName/:repoName/webhook/create'
    // SuperAgent.post('/api/github/gitDemo/task/create_branch')
   //b5aa826799211bdf5c0f6a0bf620531abe929c6
        const Data={
          taskName:'Checkout_new_branch',
          oldBranchHashVal:'b5aa826799211bdf5c0f6a0bf620531abe929c6c'
        };
      SuperAgent.post('/api/github/gitDemo/task/create_branch')
                .send(Data)
                .then((res)=>{
                  console.log(res);
                });
    //console.log('Yep, we good!');
  }
   renderHeader(){
  //   const apiCallFunct=this.testMakingAPICall;
     switch(this.props.auth){

       case false:
         return (

           <ul id="nav-mobile" class="right">
          <a class="waves-effect waves-light btn-large" href="/auth/github/login">Login with github</a>
        <a class="waves-effect waves-light btn" onClick={this.testMakingAPICall}>Test making calls to API</a>
           </ul>
         );
       default:
       return (
         <ul id="nav-mobile" class="right hide-on-med-and-down">
           <li><a href="collapsible.html">Admin user</a></li>
           <li><a href="sass.html">Go to projects page</a></li>
           <li><a href="badges.html">Add teammates</a></li>
           <li><a href="badges.html">Add new tasks</a></li>
           <li><a href="collapsible.html">Logout</a></li>
         </ul>
       );
     }
   }

   render(){
     return(
       <div>
      {this.renderHeader()}
    </div>
    )
   }
};

export default Header;