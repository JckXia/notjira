import React ,{Component}from 'react';
import {Draggable} from 'react-beautiful-dnd';
import {ListItem} from '@material-ui/core';
//this.props.todoItem
//this.props.detail
class TaskContainer extends React.Component{
   render(){
     return(
      <div class="card blue-grey darken-1">

      </div>
    )
   }
};

class TaskItem extends React.Component{
  render(){
    const {provided,innerRef}=this.props;
    return(
      <TaskContainer
        {...provided.draggableProps}
        ref={innerRef}
        >
          <div class="card-content white-text">
            <span class="card-title">LOL</span>
            <p>Update selenium server</p>
          </div>
          <div class="card-action">
            <a href="#">Reassign</a>
            <a href="#">Mark as done</a>
          </div>
      </TaskContainer>
    )
  }
};
class ToDoCard extends Component{

 constructor(props){
   super(props);
   this.state={
     id:props.id,
    CardStatus:"InProg"
   }
   this.handleDoneClick=this.handleDoneClick.bind(this);
  console.log(props);
}

handleDoneClick(){
  var oldData=this.props.originalData;
  debugger;
  oldData.cardState="Done";
  this.props.parentComponent.setState((prevState)=>{

     let cardInfo=prevState.data;
     let newApp=cardInfo.map((card)=>{
        if(card.id == this.state.id){
          card.cardState="Done";
        }
         return card;
     });

   return {data:newApp}
     console.log('NEW APP',newApp)
  });
}





   render(){
      return(
        <Draggable draggableId={this.props.id} index={this.props.id}>
          {(provided)=>(
               <TaskItem provided={provided} innerRef={provided.innerRef}/>
          )}
      </Draggable>
      )
   }
}

export default ToDoCard;
