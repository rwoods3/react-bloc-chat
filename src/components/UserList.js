import React, { Component } from 'react';

class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {userList: []};

    this.userListRef = this.props.firebase.database().ref('users');
  }

  componentDidMount() {
    this.userListRef.on('child_added', snapshot => {
      const user = snapshot.val();
      user.key = snapshot.key;
      this.setState({ userList: this.state.userList.concat( user ) });
    });

    this.userListRef.on('child_changed', snapshot => {
      const user = snapshot.val();
      user.key = snapshot.key;
      
      //this.setState({ userList: this.state.userList.filter((user) => user ) });
    });
  }

  render() {
    return(
      <div className="userList mdl-tabs__panel" id="user-panel">
        <ul>
          {this.state.userList.map((user) => <li key={user.key} className={user.online ? "online" : "offline"}><span>{user.username}</span></li>)}
        </ul>
      </div>
    );
  };
}

export default UserList;
