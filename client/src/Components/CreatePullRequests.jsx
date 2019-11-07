import React from 'react';
import Request from 'superagent';
import styled from 'styled-components';
import {UnControlled as CodeMirror} from 'react-codemirror2';
import parse from 'parse-diff';
import Button from '@material-ui/core/Button';
import request from 'superagent';
require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');
require('codemirror/mode/xml/xml.js');
require('codemirror/mode/javascript/javascript.js');
require('../styles/CodeMirrorOverride.css');

const FileDiffContainer=styled.div`
 padding-top: 20px;
`;
const FileChangeInfo=styled.code`
   margin-left:calc(14% - 33px);
   margin-right:calc(47% - 50px);
   font-weight:bold;
`;

const RenderCodeDiffOntoCodeMirror=({diff,originBranch,targetBranch,user,repoName,taskId})=>{
  const files=parse(diff);

  return(  <>
    <h4>
     {`Merge ${originBranch} into ${targetBranch}`}
   </h4>
   <Button variant="contained" color="primary" onClick={()=>{
        
       const requestData={owner:user,repo:repoName,base:targetBranch,head:originBranch,taskId:taskId};
       request.post('/api/github/LOL/createPullRequest').send(requestData).then((res)=>{
          const responseBody=res.body;
         if(responseBody.status === 422){
            return alert(responseBody.message);
         }
       return alert('Pull request successfully created!');
       });

     }}>
      Create pull request
   </Button>
    {files.map((file)=>{

    let changedCode='';
     file.chunks[0].changes.map((change,index)=>{
        changedCode=changedCode+change.content+'\n';
     })

      return(
        <FileDiffContainer>
      <>
         <FileChangeInfo>
          {file.chunks[0].content} &nbsp; {file.to}
         </FileChangeInfo>
               <CodeMirror
                 autoCursor={true}
                 value={changedCode}
                options={{
                 mode: 'javascript',
                 theme: 'material',
                 readOnly:false,
                 lineNumbers: true,
                 lineWrapping:false,
                 indentUnit:0
               }}

               onKeyDown={(editor,event)=>{
                 event.preventDefault();
               }}
               onContextMenu={(editor,event)=>{
                 event.preventDefault();
               }}
               onMouseDown={(editor,event)=>{
                 event.preventDefault();
               }}
               onChange={(editor, data, value) => {
                 console.log('Uncontrolled');
               }}
              />

           </>
   </FileDiffContainer>
      )
    })}
  </>)
};

export default class CreatePullRequests extends React.Component{

 state={
   code:null
 };
async componentDidMount(){
     const parsedUrl=new URL(window.location.href);
     const user=this.props.userInfo.userName || parsedUrl.searchParams.get('user');
     const repoName=parsedUrl.searchParams.get('repoName');
     const originBranch=parsedUrl.searchParams.get('originBranch');
     const targetBranch=parsedUrl.searchParams.get('targetBranch');
     const taskId=parsedUrl.searchParams.get('taskId');
     const targetUrl='/api/github/'+user+'/'+repoName+'/refs';
     const getBranchResp=await Request.get(targetUrl);
     const repoBranches=getBranchResp.body;
     let gitDiffUrl='';
     repoBranches.map((repoBranch,index)=>{
        if(repoBranch.name == originBranch){

          gitDiffUrl='https://api.github.com/repos/'+user+'/'+repoName+'/compare/'+targetBranch+'...'+originBranch;

          return;
        }
     });
    const result=await Request.get(gitDiffUrl).set('Accept','application/vnd.github.3.diff');
     const stateObject={code:result.text,originBranch:originBranch,targetBranch:targetBranch,user:user,repoName:repoName,taskId:taskId}
    this.setState(stateObject);

  }
  render(){
      const diff=this.state.code;
    return(
      <>
      {!diff && this.state.originBranch&&<h3>{`${this.state.originBranch} is up to date with ${this.state.targetBranch}`}</h3>}
        {diff && <RenderCodeDiffOntoCodeMirror diff={diff} user={this.state.user} repoName={this.state.repoName} taskId={this.state.taskId} originBranch={this.state.originBranch} targetBranch={this.state.targetBranch} />}
      </>
    )
  }
};
