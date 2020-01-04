import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Request from 'superagent';
import gitBranch from '../icons/gitBranch.png';
import gitPR from '../icons/gitPR.png';
import addBranch from '../icons/addBranch.png';
import AddBranchPanel from './AddBranchPanel';
import request from 'superagent';
import {Link} from 'react-router-dom';
const styles = {
  dialogPaper: {
      minHeight: '80px',
      maxHeight: '80vh',
  },
};
export default class IssueCardDialog extends React.Component {

  state = {
    open: false,
    addBranchDialogStatus:false,
    repoName:'',
    repoWebHookUrl:''
  };

 async componentDidMount(){

    const queryData={
        taskId:this.props.taskId,
        repoName:this.props.repoName
    };
   const getTaskApiResp=await Request.get('/api/github/test/getOneTask').query(queryData);
  const taskData=getTaskApiResp.body;

  this.setState(taskData);
}

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    let stateObject={...this.state};
    stateObject.isInBranchCreationMode=false;
    stateObject.open=false;
    this.setState(stateObject);
  };

  isInBranchCreationMode=()=>{
    this.setState({isInBranchCreationMode:true});
  };
  exitBranchCreationMode=()=>{
    this.setState({isInBranchCreationMode:false});
  };

  branchCreationApiCall=(targetBranchName,branchName)=>{

  };
  //router.post('/api/github/delete_branch',gitHub_controller.deleteBranch);
   branchDeleteionApiCall=(branchToBeDeleted)=>{
      const repoBranches=this.props.repoBranches;
      repoBranches.map((branch)=>{
        if(branch.branchName === branchToBeDeleted){

          const repo=this.props.repoName;
          const ref=branch.branchName;
          const owner=this.props.userInfo.userName;
          const taskId=this.props.taskId;
          const requestData={repo,ref,owner,taskId};
          request.post('/api/github/delete_branch').send(requestData).then((res)=>{
            console.log(res);
            alert('Successfully deleted branch!');
                  window.location.reload();
          });

        }
      });
  };

  makePullRequestForBranch=(branchName)=>{
    const owner=this.props.userInfo.userName;
    const repo=this.props.repoName;
    let head='refs/heads/'+branchName;

   const taskId=this.props.taskId;
    let base='';
    const taskBranches=this.state.branch;
    taskBranches.map((branch)=>{
       const trimedBranchName=branch.refName.replace('refs/heads/','');

      if(trimedBranchName === branchName){
        //branchName is the branch that we want to make PR for
        base=branch.parentBranchName
      }
    });
        const requestData={owner,repo,head,base,taskId};
      request.post('/api/github/LOL/createPullRequest').send(requestData).then((res)=>{
         const responseBody=res.body;
        if(responseBody.status === 422){
           return alert(responseBody.message);
        }
      return alert('Pull request successfully created!');
      });
  }

  getParentBranchName=(branchName)=>{
      const onwer=this.props.userInfo.userName;
      const repo=this.props.repoName;
     const taskBranches=this.state.branch;
     let retVal='';
      taskBranches.map((branch,index)=>{
        const trimedBranchName=branch.refName.replace('refs/heads/','');

         if(trimedBranchName === branchName){
           retVal=branch.parentBranchName;
            return;
         }
      })
      return retVal;
  }

  render() {
      const branchData=this.state.branch;
      const pullRequestData=this.state.pullRequest;

    return (

      <div>
          <a href="#" onClick={this.handleClickOpen}  >View More</a>

        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          disableBackdropClick={true}
          aria-labelledby="form-dialog-title"
          fullWidth
        >
          <DialogTitle id="form-dialog-title"><h5>
            <b>{this.props.taskName}</b>
          </h5>
        </DialogTitle>
           {this.state.isInBranchCreationMode?

           <DialogContent>
             <AddBranchPanel {...this.props} taskName={this.props.taskName} onBranchCreationCancel={this.exitBranchCreationMode}/>
           </DialogContent>

             : <DialogContent>
                     <DialogContentText>
                       {this.state.taskDesc}
                     </DialogContentText>
                   <h6><img src={gitBranch} className="gitBranchLogo"/><b><strong>&nbsp; Subtasks</strong></b><a href="#" onClick={this.isInBranchCreationMode}><img src={addBranch} className="right"/></a></h6>
                       <table>

            <tbody>
              {branchData && branchData.map((branch,index)=>{
                  let branchName= branch.branchRefData.refName.replace('refs/heads/',"");
                  let linkUrl='https://www.github.com/'+this.props.userInfo.userName+'/'+this.props.repoName+'/tree/'+branchName;
                  const truncateUrl=linkUrl.substring(0,28);

                  let parentBranch=this.getParentBranchName(branchName);
                parentBranch= parentBranch.replace('refs/heads/','');
                  const createPullRequestUrl=`/pullRequest/?repoName=${this.props.repoName}&originBranch=${branchName}&targetBranch=${parentBranch}&taskId=${this.props.taskId}&user=${this.props.userInfo.userName}`;

                  return(
                    <tr key={index}>
                       <td><strong>{branchName}</strong></td>
                     <td> <a href={linkUrl} target="_blank"> {truncateUrl}..</a></td>
                     <td><a href="#" onClick={()=>{this.branchDeleteionApiCall(branchName)}} >Delete</a></td>
                   <td><Link to={createPullRequestUrl}>Make PR</Link> </td>
                    </tr>
                  )
              })}

           </tbody>
           </table>

               <h6><img src={gitPR} className="gitPullRequestLogo"/><b><strong>&nbsp; Pull requests</strong></b></h6>
                         <table>
              <tbody>
                {pullRequestData && pullRequestData.map((item)=>{
                  let linkUrl=item.pullRequestUrl.replace('api.','');
                    linkUrl=linkUrl.replace('repos/','');
                    linkUrl=linkUrl.replace('pulls','pull');
                  const truncateUrl=linkUrl.substring(0,28);
                      return(
                        <tr>
                          <td><strong>{item.pullRequestTitle}</strong></td>
                          <td><a href={linkUrl} target="_blank" > {truncateUrl}...</a></td>
                        </tr>
                      );
                })}
             </tbody>
             </table>
             <DialogActions>
               <Button onClick={this.handleClose} color="primary">
                 Close
               </Button>
             </DialogActions>
                   </DialogContent>
       }


        </Dialog>
      </div>
    );
  }
}
