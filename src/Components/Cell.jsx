import React, {Component} from 'react';

class Cell extends Component {
  render() {
    return (
        <th>{this.props.content}</th>
    );
  }
}

export default Cell;
