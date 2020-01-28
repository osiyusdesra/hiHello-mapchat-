import React from 'react';
import Profile from '../components/EditProfile';

const EditProfile = props => {
  console.log(props);

  return (
    <>
      <Profile navigation={props.navigation} />
    </>
  );
};

export default EditProfile;
