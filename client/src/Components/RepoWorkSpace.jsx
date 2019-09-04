//On an unathenticated page, users should not be able to view the navbar items
// Users should not be able to see the cards
//Users should be able to see login with github
import React, {Component} from 'react';
import Request from 'superagent';
import styled from 'styled-components';
import Column from './column.js';
import {DragDropContext,Droppable,Draggable} from 'react-beautiful-dnd';
const data=[
  {cardId:1,cardState:"InProg",toDoItem:'Testing for crx'}
];
const Container = styled.div`
  display:flex
`;
class RepoWorkSpace extends Component {
 async componentDidMount(){
    const repoName=this.props.repoName;
    const reqUrl='/api/github/repo/'+repoName;
    const APIResp=await Request.get(reqUrl).send({});
    this.setState(APIResp);

        return repoName;
 }

 onDragEnd=result=>{
   const {destination,source,draggableId} =result;

   if(!destination){
     return;
   }
   if(destination.droppableId === source.droppableId
      && destination.index === source.index){
        return;
      }

  const start=this.state.columns[source.droppableId];
  const finish=this.state.columns[destination.droppableId];
  if(start === finish){
    const column=this.state.columns[source.droppableId];
    const newTaskIds = Array.from(column.taskIds);
    newTaskIds.splice(source.index,1);
    newTaskIds.splice(destination.index,0,draggableId);
    const newColumn={
      ...column,
      taskIds:newTaskIds
    };
     const newState={
       ...this.state,
       columns:{
         ...this.state.columns,
         [newColumn.id]:newColumn,
       }
     };
     this.setState(newState);
     return;
  }
  const startTaskIds =Array.from (start.taskIds);
  startTaskIds.splice(source.index,1);
  const newStart={
    ...start,
    taskIds:startTaskIds,
  };
  const finishTaskIds = Array.from(finish.taskIds);
  finishTaskIds.splice(destination.index,0,draggableId);
  const newFinish={
    ...finish,
    taskIds:finishTaskIds,
  };
  const newState={
       ...this.state,
       columns:{
          ...this.state.columns,
          [newStart.id]:newStart,
          [newFinish.id]:newFinish
       },
  };
  this.setState(newState);
 };
  state={
  tasks:{
    'task-1':{id:'task-1',content:'Update Git API endpoints'},
    'task-2':{id:'task-2',content:'Update current UI with MaterialUI'},
    'task-3':{id:'task-3',content:'Trim unused code'},
    'task-4':{id:'task-4',content:'Rewrite controller logic to handle error thrown'}
  },
  columns:{
    'column-1':{
      id:'column-1',
      title:'To do',
      taskIds:['task-1','task-2','task-3','task-4'],
    },
    'column-2':{
      id:'column-2',
      title:'In Progress',
      taskIds:[],
    },
    'column-3':{
      id:'column-3',
      title:'Code review',
      taskIds:[],
    },
    'column-4':{
      id:'column-4',
      title:'Done',
      taskIds:[ ],
    }
  },
  //Facilitae rendering of the columns
  columnOrder:['column-1','column-2','column-3','column-4'],
};

//export default initalData;
//this.state=
  render(){
    const {repoName} =this.props;
  return (
    <DragDropContext onDragEnd={this.onDragEnd}>
    <div class="row">
      <Container>
              {
          this.state.columnOrder.map((columnId)=>{
          const column = this.state.columns[columnId];
          const tasks=column.taskIds.map(taskId=>this.state.tasks[taskId]);

        //   const tasks=column.taskIds.map(taskId=>this.state.tasks[taskId]);
           return <Column key={column.id} column={column} tasks={tasks} />;
        })}
      </Container>
    </div>
  </DragDropContext>
);
}
};

export default RepoWorkSpace;
