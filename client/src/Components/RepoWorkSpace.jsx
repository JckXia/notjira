//On an unathenticated page, users should not be able to view the navbar items
// Users should not be able to see the cards
//Users should be able to see login with github
import React, {Component} from 'react';

class RepoWorkSpace extends Component {

  render(){
    const {repoName} =this.props;
  return (
    <h1>
      {repoName}
    </h1>
);
}
};

export default RepoWorkSpace;
