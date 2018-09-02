import React, { Component } from 'react';

class User extends Component {
  constructor(props) {
    super(props);
  }

  handleClick(e) {
    if(e.target.value === 'Sign In') {
      const provider = new this.props.firebase.auth.GoogleAuthProvider();
      this.props.firebase.auth().signInWithPopup( provider );
    }
    else {
      this.props.firebase.auth().signOut();
    }
  }

  componentDidMount() {
    this.props.firebase.auth().onAuthStateChanged(user => {
      this.props.setUser(user);
    });
  }

  render() {
    if(this.props.username === null) {
      return (
        <span className='userLoginButtons'>
          <button onClick={(e) => this.handleClick(e)} value="Sign In">Sign In</button>
        </span>
      );
    }
    else {
      return (
        <span className='userLoginButtons'>
          <span>Signed in as {this.props.username}</span>
          <button onClick={(e) => this.handleClick(e)} value="Sign Out">Sign Out</button>
        </span>
      );
    }
  }
}

export default User;
