import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

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

export default function ControlledOpenSelect(){
  const classes=useStyles();
  const branchId=Math.floor((Math.random()*10000)+1);
   const [state,setState]=React.useState({
      targetBranch:'',
      type:'feature',
      branchName:''
   });
   const inputLabel = React.useRef(null);
   const [labelWidth, setLabelWidth] = React.useState(0);

   const [age,setAge]=React.useState('');
   function handleChange(event){
      setAge(event.target.value);
   }


   React.useEffect(() => {
     setLabelWidth(inputLabel.current.offsetWidth);
   }, []);

   // const handleChange3 = name => event => {
   //
   //   let stateObject={...state};
   //
   //   stateObject.name=event.target.value;
   //      stateObject.branchName=state.type+'/PLAT'+'-'+branchId+'-test-Task';
   //
   //   setState(stateObject);
   // };
  return (
    <>
      <FormControl variant="outlined" className={classes.formControl}>
      <InputLabel ref={inputLabel} htmlFor="outlined-age-native-simple">
             From
      </InputLabel>
      <Select
         native
         value={age}
         onChange={handleChange}
         labelWidth={labelWidth}
         inputProps={{
           name: 'age',
           id: 'outlined-age-native-simple',
         }}
       >
       <option value=""/>
       <option value="master">master</option>
       <option value="hotfix">hotfix</option>
       <option value="feature/PLAT-6357">feature/PLAT-6357</option>

      </Select>
        </FormControl>

      </>
  );

}
