import React from 'react';
import styled from 'styled-components';
import {Draggable} from 'react-beautiful-dnd';
import request from 'superagent';
import IssueCardDialog from './IssueCardDialog';

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
  deleteTask(){
     const taskId=this.props.taskId;
     const repoName=this.props.repoName;
     const requestData={taskId,repoName};
     const requestUrl='/api/github/'+repoName+'/delete_task';
     request.post(requestUrl).send(requestData).then((res)=>{
       console.log(res);
       if(res.statusCode == 200){
         alert('Task deleted successfully!');
        window.location.reload();
       }else{
         alert('Unkown error occured');
       }
     });
  }
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
                  <IssueCardDialog taskId={this.props.taskId} taskName={this.props.task.content} repoName={this.props.repoName} />
                  <a onClick={()=>this.deleteTask()}>Delete</a>
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
 
export default class Task extends React.Component{
 render(){
   return(
     <Draggable draggableId={this.props.task.id} index={this.props.index}>
       {(provided,snapshot)=>(
         <Containers {...this.props}provided={provided} isDragging={snapshot.isDragging} innerRef={provided.innerRef}/>

       )}
     </Draggable>
)}
}
