import React from 'react';
import AddFriend from '../components/AddFriends';

const AddFriends = props => {
  return (
    <>
      <AddFriend navigation={props.navigation} />
    </>
  );
};

export default AddFriends;
