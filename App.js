import React, {Component} from 'react';
import 'react-native-gesture-handler';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Login from './src/screens/Login';
import Splash from './src/screens/Splash';
import Start from './src/screens/Start';
import Register from './src/screens/Register';
import Chat from './src/screens/Chat';
import MyProfile from './src/screens/MyProfile';
import EditProfile from './src/screens/EditProfile';
import EditPhoto from './src/screens/EditPhoto';
import AddFriends from './src/screens/AddFriends';
import ForgotPassword from './src/screens/ForgetPassword';
import Contacts from './src/screens/Contacts';
import DetailFriend from './src/screens/DetailFriend';
import Messages from './src/screens/Message';
import Maps from './src/screens/Maps';
const AppNavigator = createStackNavigator(
  {
    Splash: {
      screen: Splash,
    },
    Start: {
      screen: Start,
    },
    Login: {
      screen: Login,
    },
    ForgotPassword: {
      screen: ForgotPassword,
    },
    Register: {
      screen: Register,
    },
    Chat: {
      screen: Chat,
    },
    MyProfile: {
      screen: MyProfile,
    },
    EditProfile: {
      screen: EditProfile,
    },
    EditPhoto: {
      screen: EditPhoto,
    },
    AddFriends: {
      screen: AddFriends,
    },
    Contacts: {
      screen: Contacts,
    },
    DetailFriend: {
      screen: DetailFriend,
    },
    Messages: {
      screen: Messages,
    },
    Maps: {
      screen: Maps,
    },
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: 'false',
    },
  },
);

const AppContainer = createAppContainer(AppNavigator);
function Root() {
  return <AppContainer />;
}
export default Root;
