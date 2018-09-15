import React, { Component } from 'react';

class EditMessage extends Component {
  handleEnter(e) {
    if(e.key === 'Enter') {
      this.props.handleChangeMessage(e.target.value, this.props.messageKey);
    }
    else if(e.key === 'Escape') {
      this.props.handleCancelEdit();
    }
  }

  render() {
    return (
      <input type="text" className="editMessageField" onKeyDown={(e) => this.handleEnter(e)} defaultValue={this.props.children} />
    );
  }
}

export default EditMessage;
