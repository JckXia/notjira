//On an unathenticated page, users should not be able to view the navbar items
// Users should not be able to see the cards
//Users should be able to see login with github
import React, {Component} from 'react';
import Header from './header';
import DisplayUserTask from './DisplayUserTask';
class UnauthenticatedPage extends Component {
  render(){
  return (
    <div>
    <DisplayUserTask acquireProjectInfo={this.props.acquireProjectInfo} auth={this.props.auth} userData={this.props.userData}/>
</div>
);
}
};

export default UnauthenticatedPage;
