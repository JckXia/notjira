import React, { Component } from "react";
import "materialize-css";
import "materialize-css/dist/css/materialize.min.css";

import "../styles/App.css";
import Modal from "react-modal";
import Header from "./header.jsx";
import Request from "superagent";
import UnauthenticatedPage from "./UnauthenticatedPage";

import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import RepoWorkSpace from "./RepoWorkSpace";
import CreatePullRequests from "./CreatePullRequests";
import GraphQLHelperFunction from "../utils/repository";

Modal.setAppElement("#root");
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
      currentPage: "repo_lists",
      currentRepo: {},
      data: []
    };
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    //this.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  async componentDidMount() {
    let stateObject = {
      ...this.state
    };

    const reqBody = {
      query: `
      query{
        userInfo{
          userName
          repoLists{
            repo_name
            repo_admin_pk
          }
        }
      }
      `
    };

    try {
      const test = await fetch("/graphql", {
        method: "POST",
        body: JSON.stringify(reqBody),
        headers: {
          "Content-Type": "application/json"
        }
      });
      console.log(`Request status ${test.status}`);
      const decodeData = await test.json();
      console.log(decodeData);
    } catch (err) {
      console.log(`ERRROR! ${err}`);
    }
    const currentUserInformation = (await GraphQLHelperFunction.getUserInfo())
      .data.userInfo;
    console.log(currentUserInformation);

    const resp = await Request.get("/auth/github/checkForUserToken");

    if (currentUserInformation) {
      stateObject.user.userid = currentUserInformation._id;
      stateObject.user.githubId = currentUserInformation.gitHubId;
      stateObject.user.userName = currentUserInformation.userName;
      stateObject.repos = currentUserInformation.repoLists;
      stateObject.userIsLoggedIn = true;
      stateObject.currentPage = "repo_lists";
      this.setState(stateObject);
    }

    // if (resp.body) {
    //   stateObject.user.userid = resp.body._id;
    //   stateObject.user.githubId = resp.body.gitHubId;
    //   stateObject.user.userName = resp.body.username;
    //   stateObject.repos = resp.body.repo_lists;
    //   stateObject.userIsLoggedIn = true;
    //   stateObject.currentPage = "repo_lists";
    //   this.setState(stateObject);
    //   //SetState the data
    // }
    console.log("Mounted");
  }

  returnFilteredData(status) {
    console.log("Check");
    const data = this.state.data.filter(card => card.cardState == status);
    return data;
  }

  Users() {
    return <h2>Users</h2>;
  }

  async acquireProjectInfo(repoName) {
    if (!this.state.userIsLoggedIn) {
      //Failure redirect
      window.location.replace("/");
    }

    let stateObject = { ...this.state };
    stateObject.currentRepo = {};
    stateObject.currentRepo.name = repoName;
    stateObject.currentPage = "repo_detail";
    this.setState(stateObject);
    return repoName;
  }

  currentPageOnChangeHandler = page => {
    this.setState({ currentPage: page });
  };

  render() {
    const data = {
      ...this.state
    };

    return (
      <Router>
        <div className="App">
          <Header
            repoInfo={this.state.currentRepo}
            currentPageOnChange={this.currentPageOnChangeHandler}
            currentPage={this.state.currentPage}
            auth={this.state.userIsLoggedIn}
          />
          <Route
            exact
            path="/"
            render={props => (
              <UnauthenticatedPage
                acquireProjectInfo={obj => this.acquireProjectInfo(obj)}
                auth={this.state.userIsLoggedIn}
                userData={data}
              />
            )}
          />
          <Route
            path="/repo"
            render={props => (
              <RepoWorkSpace
                userInfo={this.state.user}
                auth={this.state.userIsLoggedIn}
                repoName={this.state.currentRepo.name}
              />
            )}
          />
          <Route
            path="/pullRequest"
            render={props => (
              <CreatePullRequests
                userInfo={this.state.user}
                auth={this.state.userIsLoggedIn}
              />
            )}
          />
        </div>
      </Router>
    );
  }
}

export default App;
