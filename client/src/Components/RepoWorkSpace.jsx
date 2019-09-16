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
    'toDo':{
      id:'toDo',
      title:'To do',
      taskIds:[],
    },
    'inProg':{
      id:'inProg',
      title:'In Progress',
      taskIds:[],
    },
    'codeReview':{
      id:'codeReview',
      title:'Code review',
      taskIds:[],
    },
    'done':{
      id:'done',
      title:'Done',
      taskIds:[ ],
    }
  },
  //Facilitae rendering of the columns
  columnOrder:['toDo','inProg','codeReview','done'],
};

 async componentDidMount(){
    let repoName=this.props.repoName;
    let userName=this.props.userInfo.userName;
     if(repoName === undefined){
      repoName=window.localStorage.getItem('current_repo_name');
     }
     if(userName === undefined || userName === null){
       userName=window.localStorage.getItem('current_repo_user');
           window.localStorage.setItem('current_repo_user',userName);
     }

    window.localStorage.setItem('current_repo_name', repoName);
   const checkEmptyUrl='https://api.github.com/repos/'+userName+'/'+repoName+'/contributors';
  const checkEmptyResp=await Request.get(checkEmptyUrl);

//// TODO: Authenticate all calls to git API
   if(checkEmptyResp.body == null){
    this.setState({empty:true});
     return;
   }
   //debugger;
    const reqUrl='/api/github/repo/'+repoName;
    const APIResp=await Request.get(reqUrl).send({});
    const reqTaskUrl='/api/github/'+repoName+'/getTasks';
    const taskItems=APIResp.body.taskItems;
    let stateObject={...this.state};
    const targetUrl='https://api.github.com/repos/'+userName+'/'+repoName+'/git/refs';
    const getBranchResp=await Request.get(targetUrl);

     //// TODO: At the momment, we are assuming that the repo is non empty
    const branchRefs=getBranchResp.body;
    stateObject.branch=[];
    branchRefs.map((branchData,index)=>{
        const shaKey=branchData.object.sha;
        const linkToBranch=branchData.url;
        const branchName=branchData.ref;
       stateObject.branch[index]={shaKey,linkToBranch,branchName};
    });

    const currentRef=this;

    taskItems.map((item,index)=>{


       const taskId='task-'+index;
     stateObject.tasks[taskId]= {id:taskId,content:item.taskName,task_id:item._id};
     stateObject.columns[item.task_state].taskIds.push(taskId);
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
    let currentRepo=repoName;
    if(this.state.empty == true){
      return(<div>
        <h3><code>Looks like you have an empty repo.<br/></code>
      <h5><code>Please follow instruction on github to set up this repo</code></h5>
    </h3>

      </div>)
    }
    if(repoName === undefined){
       currentRepo=window.localStorage.getItem('current_repo_name');
    }
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
           return <Column repoBranches={this.state.branch} key={column.id} repoName={currentRepo} column={column} tasks={tasks} />;
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
