import React, { Component } from 'react';
import ToDoCard from './ToDoCards';

var data={
   toDoCards:[
    {cardId:1,cardState:"In_progress"},
    {cardId:2,cardState:"To_do"},
    {cardId:3,cardState:"Completed"}
   ]
};

//Column should be passed a list of data to render, as well
//as the parent pointer to update the state
class Column extends Component{
  constructor(props){
    super(props);
    this.state={
      rerender:true
    };
  }
   render(){
      return(
        <div className="col s2 m4" >
        <blockquote className={this.props.colName}>
            <h4>{this.props.colName}</h4>
        </blockquote>

        {this.props.data.map((data)=>{
           
          return(
                <ToDoCard
                id={data.cardId}
                originalData={data}
                state={data.cardState} parentComponent={this.props.parent} toDoItem={data.toDoItem}
                />
          )
        })}

        </div>
      )
   }
};

export default Column;
