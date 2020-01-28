import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {Header, Left, Body, Title} from 'native-base';
import {GiftedChat, Send} from 'react-native-gifted-chat';
import {Bubble} from 'react-native-gifted-chat';
import firebase from '../config/config';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon1 from 'react-native-vector-icons/FontAwesome5';

export default class Message extends Component {
  state = {
    message: '',
    messageList: [],
    id: this.props.id,
    name: this.props.name,
    photo: this.props.photo,
    status: this.props.status,
    userId: '',
    userName: '',
    userAvatar: '',
  };

  onSend = async () => {
    if (this.state.message.length > 0) {
      let msgId = firebase
        .database()
        .ref('messages')
        .child(this.state.userId)
        .child(this.state.id)
        .push().key;
      let updates = {};
      let message = {
        _id: msgId,
        text: this.state.message,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        user: {
          _id: this.state.userId,
          name: this.state.userName,
          avatar: this.state.userAvatar,
        },
      };
      updates[
        'messages/' + this.state.userId + '/' + this.state.id + '/' + msgId
      ] = message;
      updates[
        'messages/' + this.state.id + '/' + this.state.userId + '/' + msgId
      ] = message;
      firebase
        .database()
        .ref()
        .update(updates);
      this.setState({message: ''});
    }
  };

  componentDidMount() {
    const id = firebase.auth().currentUser.uid;
    const db = firebase.database().ref('user/' + id);
    db.once('value').then(data => {
      const item = data.val();
      this.setState({
        userAvatar:
          item.photo ||
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAQeOYC_Uqrxp5lVzs-DalVZJg3t6cCtAFyMHeI2NejPr1-TsUUQ&s',
        userName: item.name,
        userId: id,
      });
      firebase
        .database()
        .ref('messages')
        .child(this.state.userId)
        .child(this.state.id)
        .on('child_added', val => {
          this.setState(previousState => ({
            messageList: GiftedChat.append(
              previousState.messageList,
              val.val(),
            ),
          }));
        });
    });
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: 'green',
          },
        }}
        textStyle={{
          right: {
            color: 'white',
          },
        }}
      />
    );
  }

  renderSend(props) {
    return (
      <Send {...props}>
        <View style={style.sendButton}>
          <Ionicons name="ios-paper-plane" size={35} color="blue" />
        </View>
      </Send>
    );
  }

  render() {
    return (
      <View style={style.headerWrapper}>
        <Header style={style.header}>
          <Left>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Icon1
                name="arrow-left"
                size={30}
                color="white"
                style={style.icon}
              />
            </TouchableOpacity>
          </Left>
          <Body style={style.body}>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.push('DetailFriend', {
                  id: this.props.id,
                })
              }>
              <Image
                source={
                  this.props.photo
                    ? {uri: this.props.photo}
                    : require('../assets/dummy.jpg')
                }
                style={style.avatar}
              />
            </TouchableOpacity>
            <Title style={style.title}>{this.props.name}</Title>
          </Body>
        </Header>

        <GiftedChat
          renderSend={this.renderSend}
          renderBubble={this.renderBubble}
          text={this.state.message}
          onInputTextChanged={val => {
            this.setState({message: val});
          }}
          messages={this.state.messageList}
          onSend={() => this.onSend()}
          user={{
            _id: this.state.userId,
          }}
        />
      </View>
    );
  }
}
const style = StyleSheet.create({
  body: {flexDirection: 'row', alignItems: 'center'},
  header: {
    backgroundColor: '#008b8b',
  },
  image: {
    width: wp('8%'),
    height: hp('4%'),
  },
  logoText: {
    color: 'white',
  },
  title: {
    fontWeight: 'bold',
  },
  icon: {
    color: 'white',
  },
  icon1: {
    position: 'absolute',
    left: 12,
  },
  sendButton: {
    marginRight: 20,
    marginBottom: 5,
  },
  headerWrapper: {flex: 1, backgroundColor: 'white'},
  avatar: {
    width: wp('12%'),
    height: hp('7%'),
    borderRadius: wp('50%'),
    overflow: 'hidden',
    marginRight: wp('3%'),
    backgroundColor: '#000',
    marginLeft: -50,
  },
});
