import React ,{Component}from 'react';

//this.props.todoItem
//this.props.detail

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
        <div class="card blue-grey darken-1">
          <div class="card-content white-text">
            <span class="card-title">{this.props.toDoItem}</span>
            <p>Update selenium server</p>
          </div>
          <div class="card-action">
            <a href="#">Reassign</a>
            <a href="#" onClick={this.handleDoneClick}>Mark as done</a>
          </div>
        </div>
      )
   }
}

export default ToDoCard;
