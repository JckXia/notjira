import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from '@material-ui/core/Select';
import styled from 'styled-components';
import MenuItem from '@material-ui/core/MenuItem';


export default class AddBranchDialog extends React.Component {


  render() {
     const {open,onClose}=this.props;
    return (


        <Dialog
          open={open}
          onClose={onClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Create a branch to start working on task</DialogTitle>
          <DialogContent>
            <DialogContentText>

            </DialogContentText>


            <Select>
               <MenuItem value="kevin">Kevin</MenuItem>
            </Select>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleClose} color="primary">
             Delete
            </Button>
          </DialogActions>
        </Dialog>

    );
  }
}
