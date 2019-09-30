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
  render() {
      const branchData=this.state.branch;
      console.log(branchData);
    return (

      <div>
          <a href="#" onClick={this.handleClickOpen}  >View More</a>

        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          disableBackdropClick={true}
          aria-labelledby="form-dialog-title"

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
                       This ticket is to aim to solve any outstanding tickets that needed to be
                       completed before the release of 7.5.6 on monday. This includes fixing
                       bugs surrounding the chrome extension and slack integration
                     </DialogContentText>
                   <h6><img src={gitBranch} className="gitBranchLogo"/><b><strong>&nbsp; Subtasks</strong></b><a href="#" onClick={this.isInBranchCreationMode}><img src={addBranch} className="right"/></a></h6>
                       <table>

            <tbody>
              {branchData && branchData.map((branch)=>{
                  let branchName= branch.branchRefData.refName.replace('refs/heads/',"");
                  let linkUrl='https://www.github.com/'+this.props.userInfo.userName+'/'+this.props.repoName+'/tree/'+branchName;
                  const truncateUrl=linkUrl.substring(0,28);
                  return(
                    <tr>
                       <td><strong>{branchName}</strong></td>
                       <td><a href={linkUrl}> {truncateUrl}..</a></td>
                       <td><a href="#">Delete</a></td>
                       <td><a href="#">Make PR</a></td>
                    </tr>
                  )
                 console.log(branch)
              })}

           </tbody>
           </table>

                     <h6><img src={gitPR} className="gitBranchLogo"/><b><strong>&nbsp; Pull requests</strong></b></h6>
                         <table>
              <tbody>
               <tr>
                 <td> <strong>feature/PLAT-7564-FixCest</strong></td>
                 <td>`https://www.google.com`</td>
                 <td><a href="#">Delete</a></td>

               </tr>

               <tr>
                 <td> <strong>feature/PLAT-6357-LiveCollab </strong></td>
                 <td>`https://www.google.com`</td>
                 <td><a href="#">Delete</a></td>

               </tr>
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
