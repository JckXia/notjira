import React, { Component } from "react";
import SuperAgent from "superagent";
import Column from "./column";
import Cell from "./Cell";
import DeleteFormDialog from "./deleteFormDialog";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class ProjectTable extends Component {
  renderHeader = () => {
    // Name
    // link to github
    // Creator name

    //  console.log(this.props.headers);
    return (
      <thead>
        <tr>
          {this.props.headers.map(headerName => {
            return <Cell content={headerName} />;
          })}
        </tr>
      </thead>
    );
  };

  deleteRepo = source => {
    console.log(source.target);
    const repoName = source.target.id;
    const deleteUrl = "/api/github/repo/" + repoName + "/delete";
    SuperAgent.post(deleteUrl).then(res => {
      window.location.reload();
    });
  };
  supplyRepoInfo = data => {
    this.props.acquireProjectInfo(data.repo_name);
  };
  renderProjectDataTable = () => {
    console.log(this.props.rows);
    return (
      <tbody>
        {this.props.rows.map(data => {
          const repoLinkUrl = `/repo/${data.repo_name}`;
          return (
            <tr>
              <td>
                {" "}
                <Link
                  to={repoLinkUrl}
                  onClick={() => this.supplyRepoInfo(data)}
                >
                  {data.repo_name}
                </Link>
              </td>
              <td>{data.date_created}</td>
              <td>
                <a href={data.repo_html_url} target="_blank">
                  {data.repo_html_url}
                </a>
              </td>
              <td>{data.repo_creator_name}</td>
              <DeleteFormDialog data={data} />
            </tr>
          );
        })}
      </tbody>
    );
  };

  render() {
    return (
      <div class="container">
        <div class="row">
          <table class="striped">
            {this.renderHeader()}
            {this.renderProjectDataTable()}
          </table>
        </div>
      </div>
    );
  }
}

export default ProjectTable;
