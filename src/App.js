import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase';
import RoomList from './components/RoomList';
import MessageList from './components/MessageList';

// Initialize Firebase
var config = {
  apiKey: "AIzaSyC-tiVW9ponHmrLdJw6KItM9CrxrmZwxUw",
  authDomain: "bloc-chat-51882.firebaseapp.com",
  databaseURL: "https://bloc-chat-51882.firebaseio.com",
  projectId: "bloc-chat-51882",
  storageBucket: "bloc-chat-51882.appspot.com",
  messagingSenderId: "915139954508"
};
firebase.initializeApp(config);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {activeRoom: undefined, activeRoomName: undefined};
  }

  handleClickRoom(e) {
    this.setState({activeRoomKey: e.target.getAttribute('data-room-key'),
                   activeRoomName: e.target.getAttribute('data-room-name')});
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Bloc Chat</h1>
        </header>
        <section className="App-room-content">
          <RoomList activeRoom={this.state.activeRoomKey} handleClickRoom={(e) => this.handleClickRoom(e)} firebase={firebase}></RoomList>
          <section className="App-room-chat-area">
            <MessageList activeRoom={this.state.activeRoomKey} activeRoomName={this.state.activeRoomName} firebase={firebase}></MessageList>
          </section>
        </section>
      </div>
    );
  }
}

export default App;
