import React, { Component } from 'react';

class RoomList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: [],
      newRoomName: ''
    };

    this.roomsRef = this.props.firebase.database().ref('rooms');
  }

  componentDidMount() {
    this.roomsRef.on('child_added', snapshot => {
      const room = snapshot.val();
      room.key = snapshot.key;
      this.setState({ rooms: this.state.rooms.concat( room ) })
    });

    this.roomsRef.on('child_removed', snapshot => {
      this.setState({rooms: this.state.rooms.filter((room) => room.key !== snapshot.key)});
    });
  }

  handleChange(event) {
    this.setState({newRoomName: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    // Simple validation to make sure we can't create rooms with no name
    if(this.state.newRoomName !== '') {
      this.roomsRef.push({
        name: this.state.newRoomName
      });

      // popup toast, yummy
      var notification = document.querySelector('.mdl-js-snackbar');
      notification.MaterialSnackbar.showSnackbar(
        {
          message: "Created room " + this.state.newRoomName
        }
      );

      // Clear textbox after creating new room
      this.setState({newRoomName: ''});

      // TODO: fix mdl textbox style, something to do with upgradeElment not working after submit so the label remains hovering above the field
    }
  }

  handleDeleteRoom(e, roomKey) {
    var roomName = this.state.rooms.filter((room) => room.key === roomKey)[0].name;

    this.props.firebase.database().ref("rooms/" + roomKey).remove(() => {
      // popup toast, yummy
      var notification = document.querySelector('.mdl-js-snackbar');
      notification.MaterialSnackbar.showSnackbar(
        {
          message: "Removed room " + roomName
        }
      );
    });
  }

  render() {
    return (
      <div className="availableChatRooms mdl-grid mdl-grid--no-spacing">
        <div className="roomsHeader mdl-cell mdl-cell--12-col">
          <h5>Available Chat Rooms</h5>
        </div>

        <div className="roomsList mdl-grid mdl-grid--no-spacing">
          {this.state.rooms.map((room) =>
            <div key={room.key + "_room"} className="roomItemContainer mdl-grid mdl-grid--no-spacing">
              <div className="mdl-cell mdl-cell--2-col">
               <span><i className="material-icons md-18" onClick={(e) => this.handleDeleteRoom(e, room.key)}>delete_forever</i></span>
               <span><i className="material-icons md-18">edit</i></span>
              </div>
              <div data-room-key={room.key}
                   data-room-name={room.name}
                   className={'mdl-cell mdl-cell--10-col availableRoomItem' + (this.props.activeRoom === room.key ? ' activeRoom' : '')}
                   key={room.key}
                   onClick={this.props.handleClickRoom}>
                   {room.name}
              </div>
            </div>
          )}
        </div>

        <div className="roomsForm mdl-cell mdl-cell--12-col">
          <form className="newRoomForm" onSubmit={(e) => this.handleSubmit(e)}>
            <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
              <label htmlFor="newRoomTextbox" className="mdl-textfield__label">Enter name of new room...</label>
              <input name="newRoomTextbox" autoComplete="off" className="mdl-textfield__input" type="text" value={this.state.newRoomName} onChange={(e) => this.handleChange(e)} />
            </div>
            <input type="submit"
                   value="Create Room"
                   className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent"/>
          </form>
        </div>
      </div>
    );
  }
}

export default RoomList;
