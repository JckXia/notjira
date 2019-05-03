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
    return (<thead>
      <tr>
        <Cell content="Repo name"/>
        <Cell content="Creation date"/>
        <Cell content="link to repo"/>
        <Cell content="Repo creator"/>
      </tr>
    </thead>);
  }

  renderProjectDataTable=()=>{
      const data=[1,2,3];
      return(
        <tbody>
          {data.map(()=>{
            return(
            <tr>
              <td>Test</td>
              <td>Eclair</td>
              <td>$0.87</td>
              <td>$0.87</td>
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
