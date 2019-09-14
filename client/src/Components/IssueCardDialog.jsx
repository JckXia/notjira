import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import SuperAgent from 'superagent';
import gitBranch from '../icons/gitBranch.png';
import gitPR from '../icons/gitPR.png';
import addBranch from '../icons/addBranch.png';


export default class IssueCardDialog extends React.Component {
  state = {
    open: false,
    repoName:'',
    nameMatch:false,
    repoWebHookUrl:''
  };

 componentDidMount(){

 }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
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
              This ticket is to aim to solve any outstanding tickets that needed to be
              completed before the release of 7.5.6 on monday. This includes fixing
              bugs surrounding the chrome extension and slack integration
            </DialogContentText>

          <h6><img src={gitBranch} className="gitBranchLogo"/><b><strong>&nbsp; Subtasks</strong></b><a href="#"><img src={addBranch} className="right"/></a></h6>
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

          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Close
            </Button>

          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
