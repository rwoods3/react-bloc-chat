import React, { Component } from 'react';

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {messages: [], newMessage: ''};

    this.messagesRef = this.props.firebase.database().ref('messages');
  }

  componentDidMount() {
    this.messagesRef.on('child_added', snapshot => {
      const message = snapshot.val();
      message.key = snapshot.key;
      this.setState({ messages: this.state.messages.concat( message ) });
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
        <div className="messageList">
          <h3>{this.props.activeRoomName}</h3>
          <section className="chatArea" ref="messageList">
            {this.state.messages
                .filter((message) => this.props.activeRoom === message.roomId)
                .map((message, index) =>
                  <div key={index} data-username={message.username} data-sent-at={message.sentAt}>
                    <span className="messageRowUser">{message.username}</span>: <span className="messageRowContent">{message.content}</span> <span className="messageRowTime">{this.convertTimestampToTime(message.sentAt)[1] + ":" + this.convertTimestampToTime(message.sentAt)[2]}</span>
                  </div>
            )}
          </section>
          <section className="newMessageArea">
            <form method="post" onSubmit={(e) => this.handleSubmit(e)}>
              <label htmlFor="newMessageBox">Enter a new chat message</label>
              <input type="textbox"
                     name="newMessageBox"
                     onKeyPress={(e) => this.handleKeyPress(e)}
                     onChange={(e) => this.handleChange(e)}
                     value={this.state.newMessage} />
              <input ref="newMessageFormSubmit" type="submit" hidden="hidden" />
            </form>
          </section>
        </div>
      );
    }
  }
}

export default MessageList;
