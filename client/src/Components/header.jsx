import React, {Component,Link} from 'react';
import SuperAgent from 'superagent';
import FormDialog from './FormDialog';
import CreateTaskDialog from './CreateTaskDialog';
class Header extends Component {


  componentDidMount() {

    if(window.location.href.includes('repo/')){
      this.setState({currentPage:'repo_detail'});
    }else{
      this.setState({currentPage:'repo_lists'});
    }
      window.onpopstate = ()=> {

          const currentUrl=window.location.href;
          if(currentUrl.includes('repo/')){
            this.setState({currentPage:'repo_detail'});
            //this.currentPage='repo_detail';
          }else{
                this.setState({currentPage:'repo_lists'});
          }
      }
    }

  getCurrentRepoName=()=>{
     const currentUrl=window.location.href;
     let repoName=currentUrl.split('repo/').pop();
     if(repoName.slice(-1) == "#"){
       repoName=repoName.substring(0,repoName.length-1);
     }
     return repoName;
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
      const currentRepoName= this.getCurrentRepoName();
    const currentUrl=window.location.href;
    console.log(this.props.currentPage);
    switch (this.props.auth) {

      case false:
        return (<ul id="nav-mobile" className="right">
          <a className="waves-effect waves-light btn-large" href="/auth/github/login">Login with github</a>
        </ul>);
      case true:
        if(this.state.currentPage =='repo_lists'){
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
      return (<ul id="nav-mobile" className="right">

        <li>
          <a href="sass.html">Backlog</a>
        </li>
        <li>
          <CreateTaskDialog currentRepo={currentRepoName}/>
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
