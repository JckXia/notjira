//On an unathenticated page, users should not be able to view the navbar items
// Users should not be able to see the cards
//Users should be able to see login with github
import React, {Component} from 'react';
import Request from 'superagent';
class RepoWorkSpace extends Component {
 async componentDidMount(){
    const repoName=this.props.repoName;
    const reqUrl='/api/github/repo/'+repoName;
    const APIResp=await Request.get(reqUrl).send({});

    this.setState(APIResp);
    console.log(APIResp);
        return repoName;
 }
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
