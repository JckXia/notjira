import React, { Component } from 'react';
import logo from './logo.svg';
import  'materialize-css/dist/css/materialize.min.css'
import {Row,Col,Card} from 'react-materialize';
import Column from './column';
import './App.css';
import Modal from 'react-modal';

//Within the App file, keep a list of all cards in this way
/*
  cards:[
     0=>[cardId=>1,cardState=>In progress,toDoItem="blah",toDoItemDetail="check chec"],
     1=>[cardId=>2,cardState=>Finished,toDoItem="PCO",todoItemDetail="using socketio to replace old rest api"]
  ]
*/
const customStyles={
    content:{
top                   : '50%',
left                  : '50%',
right                 : 'auto',
bottom                : 'auto',
marginRight           : '-50%',
transform             : 'translate(-50%, -50%)'
    }
};

Modal.setAppElement('#root');
class App extends Component {

  constructor() {
   super();

   this.state = {
     triggerRerender: false,
     data:[
       {cardId:1,cardState:"InProg",toDoItem:"Testing for crx"},
       {cardId:2,cardState:"ToDo",toDoItem:"Writing a new code base"},
       {cardId:3,cardState:"Done",toDoItem:"Ask her out"},
        {cardId:4,cardState:"Done",toDoItem:"Ask her out"}
     ]
   };
   this.openModal = this.openModal.bind(this);
   this.afterOpenModal = this.afterOpenModal.bind(this);
   this.closeModal = this.closeModal.bind(this);
 }

 openModal() {
   this.setState({modalIsOpen: true});
 }

 afterOpenModal() {
   // references are now sync'd and can be accessed.
   //this.subtitle.style.color = '#f00';
 }

 closeModal() {
   this.setState({modalIsOpen: false});
 }

componetDidUpdate(){

}
 returnFilteredData(status){
  console.log('Check');
   const data=this.state.data.filter(card=>card.cardState==status);
   return data;
 }
  render() {
    return (
      <div className="App">

    <header>
      <nav>
        <div class="nav-wrapper">

          <a href="#" class="brand-logo">NotJIRA</a>
          <ul id="nav-mobile" class="right hide-on-med-and-down">
            <li><a href="collapsible.html">Admin user</a></li>
            <li><a href="sass.html">Go to projects page</a></li>
            <li><a href="badges.html">Add teammates</a></li>
            <li><a href="badges.html">Add new tasks</a></li>
            <li><a href="collapsible.html">Logout</a></li>
          </ul>
        </div>
      </nav>
    </header>

    <div class="row">
      <Column colName="In_progress" colType="InProg" data={this.returnFilteredData("InProg")}  parent={this}/>
      <Column colName="To do"  colType="ToDo" data={this.returnFilteredData("ToDo")} parent={this}/>
      <Column colName="Completed" colType="Done" data={this.returnFilteredData("Done")} parent={this}/>
    </div>
      </div>
    );
  }
}

export default App;
