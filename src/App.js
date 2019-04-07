import React, { Component } from 'react';
import logo from './logo.svg';
import  'materialize-css/dist/css/materialize.min.css'
import {Row,Col,Card} from 'react-materialize';
import './App.css';
import Modal from 'react-modal';


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
     modalIsOpen: false
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
   <div class="col s2" >
    <blockquote className="todo">
      <h4> All tickets  </h4>
    </blockquote>

     <div class="card blue-grey darken-1">
       <div class="card-content white-text">
         <span class="card-title">Integrate Google SSO with NotJIRA</span>
         <p>Integrate google sso login with NotJIRA,with passport.js</p>
       </div>
       <div class="card-action">
         <a href="#" onClick={()=>{
             this.openModal();
           }}>Reassign</a>
           <Modal
         isOpen={this.state.modalIsOpen}
         onAfterOpen={this.afterOpenModal}
         onRequestClose={this.closeModal}
         style={customStyles}
         contentLabel="Example Modal"
       ></Modal>
         <a href="#">Mark as done</a>
       </div>
     </div>




   </div>

  <div class="col s2" >
   <blockquote className="team-completed">
     <h4> team completed </h4>
   </blockquote>
    <div class="card blue-grey darken-1">
      <div class="card-content white-text">
        <span class="card-title">Remove CSS reset</span>
        <p>Remove old version of CSS reset to improve performance</p>
      </div>
      <div class="card-action">
        <a href="#"></a>
        <a href="#">Reopen task</a>
      </div>
    </div>
    <div class="card blue-grey darken-1">
      <div class="card-content white-text">
        <span class="card-title">Add scroll bar to navigation</span>
        <p>Adding navigation to projects page</p>
      </div>
      <div class="card-action">
        <a href="#">This is a link</a>
        <a href="#">This is a link</a>
      </div>
    </div>

  </div>

  <div class="col s2" >
   <blockquote className="bugs">
     <h4>Bugs/blockers</h4>
   </blockquote>

    <div class="card blue-grey darken-1">
      <div class="card-content white-text">
        <span class="card-title">Incorrect permission level displayed</span>
        <p>Permission checks arent being performed prior to performing API call</p>
      </div>
      <div class="card-action">
        <a href="#" >Assign</a>
        <a href="#">Close</a>
      </div>
    </div>
  </div>

  <div class="col s2" >
   <blockquote className="todo">
     <h4>Your tasks</h4>
   </blockquote>
    <div class="card blue-grey darken-1">
      <div class="card-content white-text">
        <span class="card-title">Update selenium server</span>
        <p>Update selenium server</p>
      </div>
      <div class="card-action">
        <a href="#">Reassign</a>
        <a href="#">Mark as done</a>
      </div>
    </div>
    <div class="card blue-grey darken-1">
      <div class="card-content white-text">
        <span class="card-title">AWS ES failed</span>
        <p>Track down all shards information</p>
      </div>
      <div class="card-action">
        <a href="#">Reassign</a>
        <a href="#">Mark as done</a>
      </div>
    </div>

  </div>

  <div class="col s2" >
   <blockquote className="in-progress">
     <h4> In progress</h4>
   </blockquote>
    <div class="card blue-grey darken-1">
      <div class="card-content white-text">
        <span class="card-title">Migrate app from AWS to GCP</span>
        <p>Migrate service provider to google cloud computing platform</p>
      </div>
      <div class="card-action">
        <a href="#">Reassign</a>
        <a href="#">Mark as done</a>
      </div>
    </div>
    <div class="card blue-grey darken-1">
      <div class="card-content white-text">
        <span class="card-title">Upgrade node.js version</span>
        <p>Upgrade the version of node.js</p>
      </div>
      <div class="card-action">
        <a href="#">This is a link</a>
        <a href="#">This is a link</a>
      </div>
    </div>

  </div>
  <div class="col s2" >
   <blockquote className="team-completed">
     <h4>You finished</h4>
   </blockquote>
    <div class="card blue-grey darken-1">
      <div class="card-content white-text">
        <span class="card-title">POC for new UI</span>
        <p>Create a new UI for notJIRA</p>
      </div>
      <div class="card-action">
        <a href="#">Reopen task</a>
      </div>
    </div>
    <div class="card blue-grey darken-1">
      <div class="card-content white-text">
        <span class="card-title">Integrate NotJIRA with socketio POC</span>
        <p> Investigate how to integrate socketio and NotJIRA in both prod and dev</p>
      </div>
      <div class="card-action">
        <a href="#">This is a link</a>
        <a href="#">This is a link</a>
      </div>
    </div>

  </div>

  </div>





      </div>
    );
  }
}

export default App;
