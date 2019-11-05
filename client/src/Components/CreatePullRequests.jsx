import React from 'react';
import Request from 'superagent';
import styled from 'styled-components';
import {UnControlled as CodeMirror} from 'react-codemirror2';
import parse from 'parse-diff';
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

const RenderCodeDiffOntoCodeMirror=({diff})=>{
  const files=parse(diff);

  return(  <>
    <h4>
     {`Merge feature/PLAT-3635-ASD into Master`}
   </h4>
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
  //  console.log(result.text);
    const files=parse(result.text);

    this.setState({code:result.text});

  }
  render(){
      const diff=this.state.code;
    return(
      <>
        {diff && <RenderCodeDiffOntoCodeMirror diff={diff} />}
      </>
    )
  }
};
