import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import SuperAgent from 'superagent';




export default class DeleteFormDialog extends React.Component {
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
          <td><a href="#" onClick={this.handleClickOpen} id={this.props.data.name}>Delete</a></td>

        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Danger! You are attempting to delete this repo</DialogTitle>
          <DialogContent>
            <DialogContentText>
            Please type the name of the repo <b>{this.props.data.name}</b> in the box to confirm deletion.
            This action is irreversible
            </DialogContentText>
            <TextField
            error={!this.state.nameMatch}
             required
             autoFocus
             margin="normal"
             id="GitRepoName"
             label="Github Repo Name"
             onChange={this.handleRepoNameChange}
             type="WebHookUrl"
             fullWidth
             variant="outlined"
            />

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
