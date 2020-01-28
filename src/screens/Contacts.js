import React from 'react';
import ListFriends from '../components/Contacts';

const Contacts = props => {
  return (
    <>
      <ListFriends navigation={props.navigation} />
    </>
  );
};

export default Contacts;
