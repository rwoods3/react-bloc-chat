import React, { Component } from 'react';

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {messages: []};

    this.messagesRef = this.props.firebase.database().ref('messages');
  }

  componentDidMount() {
    this.messagesRef.on('child_added', snapshot => {
      const message = snapshot.val();
      message.key = snapshot.key;
      this.setState({ messages: this.state.messages.concat( message ) });
    });
  }

  render() {
    if(this.props.activeRoom === undefined) {
      return (
        <div>
          <h3>Not currently in a chatroom</h3>
          <h4>Select or create one to start chatting</h4>
        </div>
      );
    } else {
      return (
        <div>
          <h3>{this.props.activeRoomName}</h3>
          {this.state.messages
              .filter((message) => this.props.activeRoom === message.roomId)
              .map((message, index) =>
                <p key={index} data-username={message.username} data-sent-at={message.sentAt}>
                  {message.username}: {message.content}
                </p>
          )}
        </div>
      );
    }
  }
}

export default MessageList;
