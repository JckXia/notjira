import React from 'react';
import Request from 'superagent';
import {UnControlled as CodeMirror} from 'react-codemirror2';
require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');
require('codemirror/theme/neat.css');
require('codemirror/mode/xml/xml.js');
require('codemirror/mode/javascript/javascript.js');
export default class CreatePullRequests extends React.Component{

async componentDidMount(){
     const parsedUrl=new URL(window.location.href);
     const user=this.props.userInfo.userName;
     const repoName=parsedUrl.searchParams.get('repoName');
     const originBranch=parsedUrl.searchParams.get('originBranch');
     const targetUrl='/api/github/'+user+'/'+repoName+'/refs';
     const getBranchResp=await Request.get(targetUrl);
     const repoBranches=getBranchResp.body;
     let gitDiffUrl='';
     repoBranches.map((repoBranch,index)=>{
        if(repoBranch.name == originBranch){
          console.log(repoBranch.commit.sha);
           gitDiffUrl='https://api.github.com/repos/'+user+'/'+repoName+'/commits/'+repoBranch.commit.sha;
            return;
        }
     });
    const result=await Request.get(gitDiffUrl).set('Accept','application/vnd.github.3.diff');
    console.log(result.text);

  }
  render(){
    return(

      <CodeMirror
        value='const a =10;'
      options={{
        mode: 'javascript',
        theme: 'material',
        lineNumbers: true
      }}
      onChange={(editor, data, value) => {
        console.log('Uncontrolled');
      }}
     />

    )
  }
};
