import React from 'react';
import ChatRoom from '../components/Chat';

class Chat extends React.Component {
  render() {
    return (
      <>
        <ChatRoom navigation={this.props.navigation} />
      </>
    );
  }
}

export default Chat;
