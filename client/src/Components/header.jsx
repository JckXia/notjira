import React, {Component,Link} from 'react';
import SuperAgent from 'superagent';
import FormDialog from './FormDialog';
import CreateTaskDialog from './CreateTaskDialog';
class Header extends Component {

  testMakingAPICall = () => {

    /*  Check login status
    SuperAgent.post('/auth/github/checkUserStatus')
               .then((res)=>{
                console.log(res);
               });
    */
    //Test making calls to all github APIs, expect correct results.
    //Test the following:
    // /api/github/:repoName/task/create_branch

    //  /api/github/repo/create


      const Data={
        repoName:'TestingApiCallSsXKFTR',
        proxyUrl:'https://smee.io/n2Zw6JWuJuWsf2gu'
      };
      SuperAgent.post('/api/github/repo/create')
                .send(Data)
                .then((res)=>{
                  //console.log(res);
                });

    // '/api/github/repo/:repoName/delete'

    /*
      SuperAgent.post('/api/github/repo/TestingApiCallSsX/delete')
                .then((res)=>{
                  console.log(res);
                })
    */
    //'/api/github/:ownerName/:repoName/webhook/create'
    // SuperAgent.post('/api/github/gitDemo/task/create_branch')
    //b5aa826799211bdf5c0f6a0bf620531abe929c6

/*
    const Data = {
      taskName: 'Checkout_new_branch',
      oldBranchHashVal: 'b5aa826799211bdf5c0f6a0bf620531abe929c6c'
    };
    SuperAgent.post('/api/github/gitDemo/task/create_branch').send(Data).then((res) => {
      console.log(res);
    });
  */
    //console.log('Yep, we good!');
  }

  createRepo=()=>{
    const Data={
      repoName:'TestingApiCallSsXKFTR'+Math.random(),
      proxyUrl:'https://smee.io/n2Zw6JWuJuWsf2gu'
    };
    SuperAgent.post('/api/github/repo/create')
              .send(Data)
              .then((res)=>{
                //console.log(res);
                // TODO: Not a good solution. Need to change this somehow
                window.location.reload();
              });
  };
  renderHeader() {
    //   const apiCallFunct=this.testMakingAPICall;
    const currentPage=this.props.currentPage;
    switch (this.props.auth) {

      case false:
        return (<ul id="nav-mobile" class="right">
          <a class="waves-effect waves-light btn-large" href="/auth/github/login">Login with github</a>
        </ul>);
      case true:
        if(currentPage =='repo_lists'){
        return (<ul id="nav-mobile" class="right">
          <li>
            <a href="collapsible.html">Admin user</a>
          </li>
          <li>
            <a href="sass.html">Go to projects page</a>
          </li>
          <li>
           <FormDialog/>
           </li>
          <li>
            <a href="badges.html">Add new tasks</a>
          </li>
          <li>
            <a href="/auth/github/logout">Logout</a>
          </li>

        </ul>);
      }
      return (<ul id="nav-mobile" class="right">

        <li>
          <a href="sass.html">Backlog</a>
        </li>
        <li>
          <CreateTaskDialog currentRepo={this.props.repoInfo}/>
        </li>
        <li>
          <a href="/">Projects</a>
        </li>
        <li>
          <a href="/auth/github/logout">Logout</a>
        </li>
      </ul>);

    }
  }


  render() {
    return (<header>
      <nav>
        <div className="nav-wrapper">
          <a href="#" className="brand-logo">NotJira</a>
          {this.renderHeader()}
        </div>
      </nav>
    </header>);
  }
};

export default Header;
