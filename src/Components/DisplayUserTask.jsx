import React, {Component} from 'react';
import SuperAgent from 'superagent';
import Column from './column';
import ProjectTable from './ProjectTable';
class DisplayUserTask extends Component{

  returnFilteredData(status){
   console.log('Check');
   console.log(this.props);
   const data=this.props.userData.data.filter(card=>card.cardState==status);
   return data;
  }


   renderUserData(){
  //   const apiCallFunct=this.testMakingAPICall;

   const headerArr=['Repo name','Creation date','link to repo','repo creator','Delete'];
   const repoData=this.props.userData.repos;

     switch(this.props.auth){

       case false:
         return (

           <ul id="nav-mobile" className="center">
             <h3>Light, agile solution to manage your github repos</h3>
           </ul>
         );
       case true:
        if(repoData.length === 0){
          return (
            <ul id="nav-mobile" className="center">
              <h4>Looks like you don't have a repo yet. Lets create some!</h4>
            </ul>
          )
        }
       return (

         <ProjectTable headers={headerArr} rows={repoData}/>
       );
     }
   }

   render(){
     return(
       <div>
      {this.renderUserData()}
    </div>
    )
   }
};

export default DisplayUserTask;
