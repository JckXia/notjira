
import React from 'react';
import styled from 'styled-components'
import Task from './task';
import {Droppable} from 'react-beautiful-dnd';
const Container = styled.div`
  margin:8px;
  border:1px solid lightgrey;
  border-radius:2px
  width:33%;
  display:flex;
  flex-direction:column;
`;
const Title=styled.h3`
  padding:8px
`;
const TaskList = styled.div `
  padding: 20px
  flex-grow:1
  min-height:60%;
  background:#d7deda;
`;

class TaskLists extends React.Component{
  render(){
     const {provided,innerRef}=this.props;
     return (
       <TaskList
         ref={innerRef}
         {...provided.droppableProps}
         >
         {this.props.tasks.map((task,index)=>
           <Task
          key={task.id}
          task={task}
          index={index}
          innerRef={provided.innerRef}/>)}
         {provided.placeholder}
       </TaskList>
     );
  }
};

/*
<div
  ref={provided.innerRef}
  {...provided.droppableProps}
  >{this.props.tasks.map((task,index)=> <Task key={task.id} task={task} index={index} innerRef={provided.innerRef}/>)}
  {provided.placeholder}
</div>
*/

export default class Column extends React.Component{
   render(){
      return (

         <div className="col s2 m4">
       <blockquote className={this.props.column.title}>
           <Title>{this.props.column.title}</Title>
       </blockquote>
     <Droppable style={{transform:"none"}} droppableId ={this.props.column.id}>

       {(provided)=>(
      <TaskLists provided={provided} tasks={this.props.tasks} innerRef={provided.innerRef}/>

       )}
   </Droppable>
 </div>

      );
   }
};
