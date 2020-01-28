import React from 'react';
import Profile from '../components/MyProfile';

const MyProfile = props => {
  return (
    <>
      <Profile navigation={props.navigation} />
    </>
  );
};

export default MyProfile;
