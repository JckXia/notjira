import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import SuperAgent from 'superagent';

export default class CreateTaskDialog extends React.Component {
  state = {
    open: false,
    taskName:'',
    repoName:'',
    repoWebHookUrl:''
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleTaskNameChange=(e)=>{

    let state={...this.state};
   state["taskName"]=e.target.value;
    this.setState(state);
  };

  handleRepoWebHookUrlChange=(e)=>{
    let state={...this.state};
   state["repoWebHookUrl"]=e.target.value;
    this.setState(state);
  };
  handleCreateTask=()=>{
    let state={...this.state};
    const Data={
      taskName:state["taskName"],
      taskDesc:'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    };
 
    SuperAgent.post('/api/github/'+this.props.currentRepo+'/create_task')
              .send(Data)
              .then((res)=>{
              alert('Task created!');
                //console.log(res);
                // TODO: Not a good solution. Need to change this somehow
                window.location.reload();
              });
  };

  render() {
    return (

      <div>
        <a onClick={this.handleClickOpen}>Create Task</a>

        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Create a task!</DialogTitle>
          <DialogContent>
            <DialogContentText>
             To create a task, please provide us with the name of the task
            </DialogContentText>
            <TextField
             required
             autoFocus
             margin="normal"
             id="GitRepoName"
             label="Task Name"
             onChange={this.handleTaskNameChange}
             type="WebHookUrl"
             fullWidth
             variant="outlined"
            />
            <TextField
             required
             autoFocus
             margin="normal"
             label="Assign to"
             id="webHook Url"
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
            <Button onClick={this.handleCreateTask} color="primary">
              Create!
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
