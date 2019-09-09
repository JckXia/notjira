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

  state={
  tasks:{

  },
  columns:{
    'column-1':{
      id:'column-1',
      title:'To do',
      taskIds:[],
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

 async componentDidMount(){
    let repoName=this.props.repoName;
    //TODO: Store this in local storage, if repoName is null
    // Use react local-storage instead
     if(repoName === undefined){
    //   repoName=window.localStorage.getItem('current_repo_name');
     }
  //  window.localStorage.setItem('current_repo_name', repoName);

    const reqUrl='/api/github/repo/'+repoName;
    const APIResp=await Request.get(reqUrl).send({});
    const reqTaskUrl='/api/github/'+repoName+'/getTasks';
    const taskItems=APIResp.body.taskItems;
    let stateObject={...this.state};
    console.log(stateObject.tasks);
    const currentRef=this;
    taskItems.map((item,index)=>{

       const taskId='task-'+index;
     stateObject.tasks[taskId]= {id:taskId,content:item.taskName,task_id:item._id};
     stateObject.columns['column-1'].taskIds.push(taskId);
    });
     this.setState(stateObject);
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


//export default initalData;
//this.state=
  render(){
    const {repoName,auth} =this.props;
     if(auth == true){
  return (
    <DragDropContext onDragEnd={this.onDragEnd}>
    <div class="row">
      <Container>
            {
          this.state.columnOrder.map((columnId)=>{
          const column = this.state.columns[columnId];
          const tasks=column.taskIds.map(taskId=>this.state.tasks[taskId]);

        //   const tasks=column.taskIds.map(taskId=>this.state.tasks[taskId]);
           return <Column key={column.id} repoName={repoName} column={column} tasks={tasks} />;
        })}
      </Container>
    </div>
  </DragDropContext>
);
}else{
  return(
    <h3> <code>Forbidden 403. Please login!</code></h3>
  )
}

}
};

export default RepoWorkSpace;
