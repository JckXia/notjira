import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import SuperAgent from 'superagent';

export default class FormDialog extends React.Component {
  state = {
    open: false,
    repoName:'',
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
   state["repoName"]=e.target.value;
    this.setState(state);
  };

  handleRepoWebHookUrlChange=(e)=>{
    let state={...this.state};
   state["repoWebHookUrl"]=e.target.value;
    this.setState(state);
  };
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
    //Make API call
  //  this.setState({open:false});
  };
  render() {
    return (


      <div>
        <a onClick={this.handleClickOpen}>Create repo</a>

        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Create a github repo!</DialogTitle>
          <DialogContent>
            <DialogContentText>
            To create a repoistory, please give us a repoistory and  a proxy url!
            You can get the Url here at  <a href="https://smee.io" target="_blank">https://smee.io</a>
            </DialogContentText>
            <TextField
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
            <TextField
             required
             autoFocus
             margin="normal"
             id="webHook Url"
             label="WebHook Url"
             type="WebHookUrl"
             onChange={this.handleRepoWebHookUrlChange}
             fullWidth
             variant="outlined"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleCreateRepo} color="primary">
              Create!
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
