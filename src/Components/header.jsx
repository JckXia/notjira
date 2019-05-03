import React, {Component} from 'react';

class Header extends Component{
   renderHeader(){
     console.log(this.prop);
     switch(this.props.auth){

       case false:
         return (

           <ul id="nav-mobile" class="right">
          <a class="waves-effect waves-light btn-large" href="/auth/github/login">Login with github</a>
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
