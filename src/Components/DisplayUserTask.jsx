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


     switch(this.props.auth){

       case false:
         return (

           <ul id="nav-mobile" class="center">
             <h3>Light, agile solution to manage your github repos</h3>
           </ul>
         );
       case true:
       return (
         <ProjectTable heading={""} rows={"k"}/>
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
