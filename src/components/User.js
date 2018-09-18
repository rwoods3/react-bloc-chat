import React, { Component } from 'react';

class User extends Component {
  constructor(props) {
    super(props);

    this.state = {signedInAs: null};

    this.userListRef = this.props.firebase.database().ref('users');
  }

  handleClick(e) {
    if(e.currentTarget.value === 'Sign In') {
      const provider = new this.props.firebase.auth.GoogleAuthProvider();
      this.props.firebase.auth().signInWithPopup( provider )
        .then((result) => {
          // popup toast, yum
          var notification = document.querySelector('.mdl-js-snackbar');
          notification.MaterialSnackbar.showSnackbar(
            {
              message: "Signed In"
            }
          );

          // Add to list of signed in users for userList
          this.userListRef.orderByChild("uid").equalTo(result.user.uid).on("value", function(snapshot) {
            console.log(snapshot.val());
          });

/*console.log("test: " + result.key);
          this.props.firebase.database().ref('users').child(result.user.uid)
          .once('value')
          .then(function(snapshot) {
            var value = snapshot.val();
            var key = snapshot.key;
            console.log("value: " + value);
            console.log("key: " + key);
          }); */

/*
          this.userListRef.push({
            username: result.user.displayName,
            uid: result.user.uid,
            online: true
          });
*/
          this.setState({signedInAs: result.user});
        });
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

      // Set user to offline in userList
      if(this.state.signedInAs !== null) { // just in case we end up in a weird state
        this.props.firebase.database().ref("users/" + this.state.signedInAs.uid + "/online").set(false);
        this.setState({signedInAs: null});
      }
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
