import React, { Component } from 'react';
import './App.css';
import './RoomList.css';
import './MessageList.css';
import * as firebase from 'firebase';
import RoomList from './components/RoomList';
import MessageList from './components/MessageList';
import User from './components/User';

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
    this.state = { activeRoom: undefined,
                   activeRoomName: undefined,
                   username: null };
  }

  handleClickRoom(e) {
    this.setState({activeRoomKey: e.target.getAttribute('data-room-key'),
                   activeRoomName: e.target.getAttribute('data-room-name')});
  }

  setUser(newUser) {
    if(newUser !== null) {
      this.setState({ username: newUser.displayName });
    }
    else {
      this.setState({ username: null });
    }
  }

  render() {
    return (
      <div className="App">
        <header className="mdl-layout__header mdl-layout__header-row is-casting-shadow mdl-grid mdl-grid--no-spacing">
          <div className="mdl-cell mdl-cell--4-col"></div>
          <div className="mdl-cell mdl-cell--4-col mdl-cell--middle">
            <h3>Bloc Chat</h3>
          </div>
          <div className="loginButtons mdl-cell mdl-cell--4-col mdl-cell--bottom">
            <User firebase={firebase}
                  setUser={(newUser) => this.setUser(newUser)}
                  username={this.state.username} />
          </div>
        </header>
        <section className="App-room-content mdl-grid mdl-grid--no-spacing">
          <aside className="mdl-cell mdl-cell--3-col">
            <RoomList activeRoom={this.state.activeRoomKey} handleClickRoom={(e) => this.handleClickRoom(e)} firebase={firebase}></RoomList>
          </aside>
          <div className="mdl-cell mdl-cell--9-col">
            <MessageList activeRoom={this.state.activeRoomKey}
                         activeRoomName={this.state.activeRoomName}
                         firebase={firebase}
                         username={this.state.username}></MessageList>
          </div>
        </section>

        <div aria-live="assertive" aria-atomic="true" aria-relevant="text" className="mdl-snackbar mdl-js-snackbar">
          <div className="mdl-snackbar__text"></div>
          <button type="button" className="mdl-snackbar__action"></button>
        </div>
      </div>
    );
  }
}

export default App;
