import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme =>({
   formControl:{
    margin: theme.spacing(1),
    minWidth:500,
  },
  selectEmpty:{
    marginTop:theme.spacing(2),
  },
  textField: {
   marginLeft: theme.spacing(1),
   marginRight: theme.spacing(0),
   minWidth:500
 },
}));

export default function ControlledOpenSelect(taskName,onBranchCreationCancel,handleSelectChange){
  const classes=useStyles();
  const branchId=Math.floor((Math.random()*10000)+1);
  console.log(onBranchCreationCancel);
  console.log(handleSelectChange);
   const [state,setState]=React.useState({
      targetBranch:'master',
      type:'feature',
      branchName:'feature/PLAT-'+branchId+'-'+taskName.taskName
   });
   const inputLabel = React.useRef(null);
   const [labelWidth, setLabelWidth] = React.useState(0);

   function handleChange(event){
      const name=event.target.name;
      const val=event.target.value;

      if(name == 'branchName'){
        setState(oldVal=>({
          ...oldVal,
         ['branchName']:val
        }));
        return;
      }
      console.log(name);
      let prefix=state.type;
      if(name == 'type'){
        prefix = val;
      }

      const branchName=prefix+'/PLAT-'+branchId+'-'+taskName.taskName;
     setState(oldVal=>({
       ...oldVal,
       [name]:val,
       ['branchName']:branchName
     }));
   }


   React.useEffect(() => {
     setLabelWidth(inputLabel.current.offsetWidth);
   }, []);

  return (
    <>
      <FormControl variant="outlined"  margin="dense" className={classes.formControl}>
      <InputLabel ref={inputLabel} htmlFor="outlined-age-native-simple">
             From
      </InputLabel>
      <Select

         native
         value={state.targetBranch}
         onChange={(event)=>{handleChange(event);}}

         inputProps={{
           name: 'targetBranch',
           id: 'outlined-age-native-simple',
         }}
       >
       <option value=""/>
       <option value="master">master</option>
       <option value="hotfix">hotfix</option>
       <option value="feature/PLAT-6357">feature/PLAT-6357</option>

      </Select>
        </FormControl>
        <FormControl margin="dense"/>
      <FormControl variant="filled" className={classes.formControl}>
        <InputLabel ref={inputLabel} htmlFor="outlined-age-native-simple">
               Type
        </InputLabel>
        <Select
           native
           value={state.type}
           onChange={(event)=>{handleChange(event)}}
           labelWidth={labelWidth}
           inputProps={{
             name: 'type',
             id: 'outlined-age-native-simple',
           }}
         >
         <option value=""/>
       <option value="feature">feature</option>
         <option value="hotfix">hotfix</option>
       <option value="bugfix">bugfix</option>
     <option value="release">release</option>

        </Select>
          </FormControl>
          <FormControl margin="dense"/>

          <TextField
           required
           margin="normal"
           label="Branch Name"
           id="webHook Url"
           type="WebHookUrl"
           value={state.branchName}
           onChange={handleChange}
           inputProps={{
              name:'branchName',
              id:'outlined-branchName-native-simple'
           }}
           className={classes.textField}
           variant="outlined"
          />
         

      </>
  );

}
