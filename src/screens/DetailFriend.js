import React from 'react';
import Friend from '../components/DetailFriend';

const DetailFriend = props => {
  const id = props.navigation.getParam('id', {});
  return (
    <>
      <Friend navigation={props.navigation} id={id} />
    </>
  );
};

export default DetailFriend;
