import React, {Component} from 'react';
import 'materialize-css/dist/css/materialize.min.css'
import {Row, Col, Card} from 'react-materialize';
import Column from './column';
import '../styles/App.css';
import Modal from 'react-modal';
import Header from './header.jsx';
import Request from 'superagent';
import UnauthenticatedPage from './UnauthenticatedPage';

import {BrowserRouter as Router, Route, Link} from "react-router-dom";

//Within the App file, keep a list of all cards in this way
/*
  cards:[]
     0=>[cardId=>1,cardState=>In progress,toDoItem="blah",toDoItemDetail="check chec"],
     1=>[cardId=>2,cardState=>Finished,toDoItem="PCO",todoItemDetail="using socketio to replace old rest api"]
  ]
*/
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

Modal.setAppElement('#root');
class App extends Component {

  constructor() {
    super();

    this.state = {

      userIsLoggedIn: false,
      repos: null,
      user: {
        userid: null,
        githubId: null,
        userName: null
      },
      data: [
        {
          cardId: 1,
          cardState: "InProg",
          toDoItem: "Testing for crx"
        }, {
          cardId: 2,
          cardState: "ToDo",
          toDoItem: "Writing a new code base"
        }, {
          cardId: 3,
          cardState: "Done",
          toDoItem: "Go to Macmaster"
        }, {
          cardId: 4,
          cardState: "Done",
          toDoItem: "Read neethans diary"
        }
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

  async componentDidMount() {
    let stateObject = {
      ...this.state
    };
    const resp = await Request.get('/auth/github/checkForUserToken');

    if (resp.body) {

      stateObject.user.userid = resp.body._id;
      stateObject.user.githubId = resp.body.gitHubId;
      stateObject.user.userName = resp.body.username;
      stateObject.repos = resp.body.repo_lists;
      stateObject.userIsLoggedIn = true;

      this.setState(stateObject);
      //SetState the data
    }
    console.log('Mounted');
  }

  returnFilteredData(status) {
    console.log('Check');
    const data = this.state.data.filter(card => card.cardState == status);
    return data;
  }
  Index(){
    return (<h2>Test route</h2>)
  }


  render() {
    const data = {
      ...this.state
    };

    return (<Router>
      <div className="App">
        <Route path="/testRoute" exact={true} component={this.Index}/>
      <UnauthenticatedPage auth={this.state.userIsLoggedIn} userData={data}/>
      </div>
    </Router>);
  }
}

export default App;
