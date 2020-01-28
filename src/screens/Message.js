import React from 'react';
import Chat from '../components/Message';

const Message = props => {
  const id = props.navigation.getParam('id', {});
  const name = props.navigation.getParam('name', {});
  const photo = props.navigation.getParam('photo', {});
  const status = props.navigation.getParam('status', {});
  return (
    <>
      <Chat
        navigation={props.navigation}
        id={id}
        name={name}
        photo={photo}
        status={status}
      />
    </>
  );
};

export default Message;
