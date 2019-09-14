import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import SuperAgent from 'superagent';
import gitBranch from '../icons/gitBranch.png';


export default class IssueCardDialog extends React.Component {
  state = {
    open: false,
    repoName:'',
    nameMatch:false,
    repoWebHookUrl:''
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleRepoNameChange=(e)=>{

    let state={...this.state};
    const targetRepoName=this.props.data.name;
   state["repoName"]=e.target.value;
   if(e.target.value == targetRepoName){
     state["nameMatch"]=true;
   }else{
     state["nameMatch"]=false;
   }
    this.setState(state);
  };

  handleRepoWebHookUrlChange=(e)=>{
    let state={...this.state};
   state["repoWebHookUrl"]=e.target.value;
    this.setState(state);
  };
  handleDeleteRepo=()=>{

    const repoName=this.props.data.name;

    if(this.state.nameMatch == true){

    const deleteUrl='/api/github/repo/'+repoName+'/delete';
    SuperAgent.post(deleteUrl).then((res)=>{
      window.location.reload();
    });
  }
  }
  handleCreateRepo=()=>{
    let state={...this.state};
    const Data={
      repoName:state["repoName"],
      proxyUrl:state["repoWebHookUrl"]
    };
    SuperAgent.post('/api/github/repo/create')
              .send(Data)
              .then((res)=>{
                //console.log(res);
                // TODO: Not a good solution. Need to change this somehow
                window.location.reload();
              });
  };
  render() {

    return (

      <div>
          <a href="#" onClick={this.handleClickOpen}  >View More</a>

        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title"><h5>
            <b>7.5.6 release notes</b>
          </h5>
        </DialogTitle>
          <DialogContent>
            <DialogContentText>
              We are to release 7.5.6 on monday. Here is the ticket to
              prepare the code base for the release. Numberous features are added,
              notably, the new chrome extensions. The chrome extension is built
              using react and redux with modifications to various controllers.
              We will attempt to resolve any merge conflicts here
            </DialogContentText>

            <h6><img src={gitBranch} className="gitBranchLogo"/><b><strong>Subtask</strong></b></h6>
              <table>
   <tbody>
    <tr>
      <td> <strong>feature/PLAT-6357-CHROME_EXT </strong></td>
      <td>`https://www.google.com`</td>
      <td><a href="#">Delete</a></td>
      <td><a href="#">Make PR</a></td>
    </tr>

    <tr>
      <td> <strong>feature/PLAT-6357-SLAC_POC </strong></td>
      <td>`https://www.google.com`</td>
      <td><a href="#">Delete</a></td>
      <td><a href="#">Make PR</a></td>
    </tr>
  </tbody>
  </table>

          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleDeleteRepo} color="primary">
             Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
