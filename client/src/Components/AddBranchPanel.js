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
import ControlledOpenSelect from './SelectBox';



export default class AddBranchPanel extends React.Component {


  render() {
     //const {open,onClose}=this.props;
    return (
      <>
      <ControlledOpenSelect/>
      <DialogActions>
      <Button  color="primary">
        Cancel
      </Button>
      <Button  color="primary">
        Create Branch
      </Button>
      </DialogActions>
      </>
    );
  }
}
