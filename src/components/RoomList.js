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
      this.setState({newRoomName: ''}); // Clear textbox after creating new room
    }
  }

  render() {
    return (
      <div className="availableChatRooms">
        <h3>Available Chat Rooms</h3>
        {this.state.rooms.map((room) =>
          <div data-room-key={room.key}
               data-room-name={room.name}
               className={'availableRoomItem' + (this.props.activeRoom === room.key ? ' activeRoom' : '')}
               key={room.key}
               onClick={this.props.handleClickRoom}>
               {room.name}
          </div>
        )}
        <form className="newRoomForm" onSubmit={(e) => this.handleSubmit(e)}>
          <label htmlFor="newRoomTextbox">New Room Name</label>
          <input name="newRoomTextbox" type="text" value={this.state.newRoomName} onChange={(e) => this.handleChange(e)} />
          <input type="submit" value="Create New Room" />
        </form>
      </div>
    );
  }
}

export default RoomList;
