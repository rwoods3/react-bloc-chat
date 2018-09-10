import React, { Component } from 'react';

class User extends Component {
  handleClick(e) {
    if(e.currentTarget.value === 'Sign In') {
      const provider = new this.props.firebase.auth.GoogleAuthProvider();
      this.props.firebase.auth().signInWithPopup( provider );

      // popup toast, yummy
      // Give it 5 seconds to sign in
      setTimeout(() => {
      var notification = document.querySelector('.mdl-js-snackbar');
      notification.MaterialSnackbar.showSnackbar(
        {
          message: "Signed In"
        }
      )}, 5000);
    }
    else {
      this.props.firebase.auth().signOut();

      // popup toast, yummy
      var notification = document.querySelector('.mdl-js-snackbar');
      notification.MaterialSnackbar.showSnackbar(
        {
          message: "Signed Out"
        }
      );
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
            <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--accent"
                    onClick={(e) => this.handleClick(e)}
                    value="Sign In">
              Sign In
            </button>
          </span>
      );
    }
    else {
      return (
        <span className='userLoginButtons'>
          <span>Signed in as {this.props.username}</span>
          <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--accent"
                  onClick={(e) => this.handleClick(e)}
                  value="Sign Out">
            Sign Out
          </button>
        </span>
      );
    }
  }
}

export default User;
