import React, {Component} from 'react';
import SuperAgent from 'superagent';
import Column from './column';
import Cell from './Cell';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";

class ProjectTable extends Component {

  renderHeader = () => {
    // Name
    // link to github
    // Creator name

  //  console.log(this.props.headers);
    return (<thead>
      <tr>
        {this.props.headers.map((headerName)=>{

          return(
           <Cell content={headerName}/>
          )
        })}

      </tr>
    </thead>);
  }

  deleteRepo=(source)=>{
     console.log(source.target);
     const repoName=source.target.id;
     const deleteUrl='/api/github/repo/'+repoName+'/delete';
     SuperAgent.post(deleteUrl).then((res)=>{
       window.location.reload();
     });
    // const deleteUrl='/api/github/repo/'+repoName+'/delete';
     /*
     SuperAgent.post(deleteUrl)
               .then((res)=>{
                 //console.log(res);
                 // TODO: Not a good solution. Need to change this somehow
                 window.location.reload();
               });
               */
  }


  renderProjectDataTable=()=>{

      console.log(this.props.rows);
      return(
        <tbody>
          {this.props.rows.map((data)=>{

            return(
              <tr>
                <td>{data.name}</td>
                <td>{data.date_created}</td>
                 <td><a href={data.repo_html_url}>{data.repo_html_url}</a></td>
                <td>{data.repo_creator}</td>
                <td><a href="#" onClick={this.deleteRepo} id={data.name}>Delete</a></td>
              </tr>
            )
          })}
        </tbody>
      )
  }

  render() {
    return (<div class="container">
      <div class="row">
        <table class="striped">
            {this.renderHeader()}
            {this.renderProjectDataTable()}
        </table>
      </div>
    </div>)
  }
}

export default ProjectTable;
