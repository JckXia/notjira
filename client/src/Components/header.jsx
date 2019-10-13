import React, {Component,Link} from 'react';
import SuperAgent from 'superagent';
import FormDialog from './FormDialog';
import CreateTaskDialog from './CreateTaskDialog';
class Header extends Component {

   state={
     currentPage:''
   }
  componentDidMount() {
      if(window.location.href.includes('repo/')){
          this.props.currentPageOnChange({currentPage:'repo_detail'});

      }else{
      this.props.currentPageOnChange({currentPage:'repo_lists'})
      }

      window.onpopstate = ()=> {

          const currentUrl=window.location.href;
          if(currentUrl.includes('repo/')){
    this.props.currentPageOnChange('repo_detail');

          }else{
            this.props.currentPageOnChange('repo_lists');

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
     
                window.location.reload();
              });
  };
  renderHeader() {

      const currentRepoName= this.getCurrentRepoName();
      const trueCurrentUrl=window.location.href;
    const currentUrl=window.location.href;

     let targetPage=this.props.currentPage;
     if(window.location.href.includes('repo/')){
         if(this.props.currentPage == 'repo_lists'){
           targetPage='repo_detail';
         }
     }

    switch (this.props.auth) {

      case false:
        return (<ul id="nav-mobile" className="right">
          <a className="waves-effect waves-light btn-large" href="/auth/github/login">Login with github</a>
        </ul>);
      case true:
        if(targetPage =='repo_lists'){
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
