import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase';
import RoomList from './components/RoomList';

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
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Bloc Chat</h1>
        </header>
        <section className="App-room-content">
          <RoomList firebase={firebase}></RoomList>
          <section className="App-room-chat-area">
            <p>test content</p>
            <p>test content</p>
            <p>test content</p>
          </section>
        </section>
      </div>
    );
  }
}

export default App;
