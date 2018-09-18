import React, { Component } from 'react';
import EditMessage from './EditMessage.js';

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {messages: [],
                  newMessage: '',
                  editedMessage: '',
                  originalMessage: '',
                  editMessageKey: '',
                  editInProgress: false};

    this.messagesRef = this.props.firebase.database().ref('messages');
  }

  componentDidMount() {
    this.messagesRef.on('child_added', snapshot => {
      const message = snapshot.val();
      message.key = snapshot.key;
      this.setState({ messages: this.state.messages.concat( message ) });
    });

    this.messagesRef.on('child_removed', snapshot => {
      this.setState({messages: this.state.messages.filter((message) => message.key !== snapshot.key)});
    });

    this.messagesRef.on('child_changed', snapshot => {
      let updatedMessages = this.state.messages.map((message) => {
        if(message.key === snapshot.key) {
          return snapshot.val();
        }
        else {
          return message;
        }
      });

      this.setState({messages: updatedMessages});
    });
  }

  handleKeyPress = (event) => {
    if(event.key === 'Enter') {
      event.preventDefault();
      this.refs.newMessageFormSubmit.click();
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    // Simple validation to make sure we can't create rooms with no name
    if(this.state.newRoomName !== '') {
      const username = this.props.username === null ? 'Guest' : this.props.username;
      this.messagesRef.push({
        username: username,
        content: this.state.newMessage,
        sentAt: this.props.firebase.database.ServerValue.TIMESTAMP,
        roomId: this.props.activeRoom
      });
      this.setState({newMessage: ''}); // Clear textbox after creating new message

      // Scroll the most recent message into view
      const element = document.querySelector('.chatArea');
      setTimeout(() => element.scrollTop = element.scrollHeight, 1000);
    }
  }

  handleChange(event) {
    this.setState({newMessage: event.target.value});
  }

  convertTimestampToTime(timestamp) {
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    const date = new Date(timestamp*1000);
    // Hours part from the timestamp
    const hours = date.getHours();
    // Minutes part from the timestamp
    let minutes = date.getMinutes();
    if(minutes < 10) {
      minutes = "0" + minutes;
    }

    // Seconds part from the timestamp
    const seconds = date.getSeconds();

    return [date, hours, minutes, seconds];
  }

  renderDeleteIcon(user, messageKey) {
    // Should only be able to delete our own messages
    if(user !== "Guest" && user === this.props.username) {
      return <i className="material-icons md-18" onClick={(e) => this.handleDeleteMessage(e, messageKey)}>remove_circle</i>;
    }
  }

  handleFocus(e) {
    this.refs.newMessageTextbox.className = this.refs.newMessageTextbox.className + ' is-dirty';
  }

  handleBlur(e) {
    if(this.state.newMessage === '') {
      this.refs.newMessageTextbox.className = 'mdl-textfield mdl-js-textfield mdl-textfield--floating-label';
    }
  }

  handleDeleteMessage(e, messageKey) {
    this.props.firebase.database().ref("messages/" + messageKey).remove(() => {
      // popup toast, yummy
      var notification = document.querySelector('.mdl-js-snackbar');
      notification.MaterialSnackbar.showSnackbar(
        {
          message: "Message Removed"
        }
      );
    });
  }

  handleEditInProgress(e, messageKey) {
    const messageOwner = this.state.messages.find((message) => message.key === messageKey).username;

    if(messageOwner === this.props.username) {
      // will trigger the change from the original message to the EditMessage component
      this.setState({editMessageKey: messageKey, originalMessage: e.target.innerText, editInProgress: true});
    }
  }

  handleEditMessage(editedMessage, messageKey) {
    this.props.firebase.database().ref("messages/" + messageKey + "/content").set(editedMessage, () => {
      this.handleCancelEdit();
    });
  }

  handleCancelEdit() {
    this.setState({editedMessage: '',
                   originalMessage: '',
                   editMessageKey: '',
                   editInProgress: false});
  }

  render() {
    if(this.props.activeRoom === undefined) {
      return (
        <div className="noRoomSelected">
          <h3>Not currently in a chatroom</h3>
          <h4>Select or create one to start chatting</h4>
        </div>
      );
    } else {
      return (
        <div className="messageList mdl-grid mdl-grid--no-spacing">
          <div className="messageRoomHeader mdl-grid mdl-grid--no-spacing">
            <div className="mdl-cell mdl-cell--12-col">
              <h3>{this.props.activeRoomName}</h3>
            </div>
          </div>

          <section className="chatArea" ref="messageList">
            {this.state.messages
                .filter((message) => this.props.activeRoom === message.roomId)
                .map((message, index) =>
                  <div key={index + "_message"} className="mdl-cell mdl-cell--12-col mdl-cell--top mdl-grid--no-spacing">
                    <div key={index}
                         data-username={message.username}
                         data-sent-at={message.sentAt}
                         className="userMessage mdl-grid mdl-grid--no-spacing">
                      <div className="messageRowUser mdl-cell mdl-cell--2-col">{message.username}:</div>
                      <div className="messageRowContent mdl-cell mdl-cell--8-col"
                           onClick={(e) => this.handleEditInProgress(e, message.key)}>{
                             (this.state.editInProgress && (this.state.editMessageKey === message.key)) ?
                             <EditMessage messageKey={message.key}
                                          originalMessage={this.state.originalMessage}
                                          handleChangeMessage={(editedMessage, messageKey) => this.handleEditMessage(editedMessage, messageKey)}
                                          handleCancelEdit={() => this.handleCancelEdit()}>{message.content}</EditMessage>
                              :
                            message.content}
                      </div>
                      <div className="messageRowTime mdl-cell mdl-cell--1-col">{this.convertTimestampToTime(message.sentAt)[1] + ":" + this.convertTimestampToTime(message.sentAt)[2]}</div>
                      <div className="messageRowUser mdl-cell mdl-cell--1-col">
                        <span>{this.renderDeleteIcon(message.username, message.key)}</span>
                      </div>
                    </div>
                  </div>
            )}
          </section>

          <section className="newMessageArea mdl-grid mdl-grid--no-spacing">
            <div className="mdl-cell mdl-cell--12-col mdl-cell--bottom">
              <form method="post" onSubmit={(e) => this.handleSubmit(e)}>
                <div ref="newMessageTextbox" className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                  <input className="mdl-textfield__input"
                         type="textbox"
                         name="newMessageBox"
                         autoComplete="off"
                         onKeyPress={(e) => this.handleKeyPress(e)}
                         onChange={(e) => this.handleChange(e)}
                         onFocus={(e) => this.handleFocus(e)}
                         onBlur={(e) => this.handleBlur(e)}
                         value={this.state.newMessage} />
                  <label htmlFor="newMessageBox" className="mdl-textfield__label">Enter a new chat message and press Enter...</label>
                </div>
                <input ref="newMessageFormSubmit" type="submit" hidden="hidden" />
              </form>
            </div>
          </section>
        </div>
      );
    }
  }
}

export default MessageList;
