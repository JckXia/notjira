import React from 'react';
import styled from 'styled-components';
import {Draggable} from 'react-beautiful-dnd';
 
const Container=styled.div`

`;

const Handle=styled.div`
   width:20px;
   height:20px;
   background-color:orange;
   border-radius:4px;
   margin-right:8px;
`;
class Containers extends React.Component{
  render(){
    const {task,provided,innerRef,isDragging}=this.props;
    return(
      <Container
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        ref={innerRef}
        isDragging={isDragging}
        >

          <div class="card white darken-1">
                <div class="card-content black-text">
                  <span class="card-title">{this.props.task.content}</span>
                  <p>Update selenium server</p>
                </div>

                <div class="card-action">
                  <a href="#">Reassign</a>
                  <a href="#">Mark as done</a>
                </div>
              </div>
    </Container>
    )
  }
};
const StyledContainer=styled(Containers)`
border: 1px solid lightgrey;
border-radius:2px;
padding:8px;
margin-bottom:8px;
`;

/*
<div
  {...provided.draggableProps}
  {...provided.dragHandleProps}
  ref={provided.innerRef}
  >
  {this.props.task.content}
</div>
*/
export default class Task extends React.Component{
 render(){
   return(
     <Draggable draggableId={this.props.task.id} index={this.props.index}>
       {(provided,snapshot)=>(
         <Containers task={this.props.task} provided={provided} isDragging={snapshot.isDragging} innerRef={provided.innerRef}/>

       )}
     </Draggable>
)}
}
