import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import GraphQLHelperFunction from "../utils/repository";

export default class DeleteFormDialog extends React.Component {
  state = {
    open: false,
    repoName: "",
    nameMatch: false,
    repoWebHookUrl: ""
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleRepoNameChange = e => {
    let state = { ...this.state };
    const targetRepoName = this.props.data.repo_name;
    state["repoName"] = e.target.value;
    if (e.target.value == targetRepoName) {
      state["nameMatch"] = true;
    } else {
      state["nameMatch"] = false;
    }
    this.setState(state);
  };

  handleRepoWebHookUrlChange = e => {
    let state = { ...this.state };
    state["repoWebHookUrl"] = e.target.value;
    this.setState(state);
  };
  handleDeleteRepo = () => {
    const repoName = this.props.data.repo_name;

    if (this.state.nameMatch == true) {
      GraphQLHelperFunction.deleteGitHubRepository(repoName).then(res => {
        console.log(res);
        if (res.data.deleteRepo.status === 200) {
          alert(`Successfuuly deleted ${repoName}`);
          window.location.reload();
        }
      });
    }
  };

  render() {
    return (
      <div>
        <td>
          <a href="#" onClick={this.handleClickOpen} id={this.props.data.name}>
            Delete
          </a>
        </td>

        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Danger! You are attempting to delete this repo
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please type the name of the repo{" "}
              <b>{this.props.data.repo_name}</b> in the box to confirm deletion.
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
