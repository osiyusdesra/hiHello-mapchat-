import React, {Component} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {ListItem, Avatar, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Header, Left, Body, Title, Card} from 'native-base';
import Icon1 from 'react-native-vector-icons/Octicons';
import firebase from '../config/config';
import {Bubbles} from 'react-native-loader';
export default class DetailFriend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      photo: undefined,
      status: '',
      phone: '',
      isLoading: false,
    };
  }
  componentDidMount() {
    firebase
      .database()
      .ref('user/' + this.props.id)
      .once('value')
      .then(data => {
        const item = data.val();
        this.setState({
          photo: item.photo || undefined,
          name: item.name,
          phone: item.phone || 'Phone',
          status: item.status || 'Available',
          email: item.email,
        });
      });
  }

  render() {
    const {name, email, photo, status, phone, isLoading} = this.state;
    setTimeout(
      function() {
        this.setState({isLoading: true});
      }.bind(this),
      2000,
    );
    return (
      <>
        <Header style={style.header}>
          <Left>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Icon name="times" size={30} color="white" style={style.icon1} />
            </TouchableOpacity>
          </Left>
          <Body>
            <Title style={style.title}>Profile</Title>
          </Body>
        </Header>
        <View style={style.wrapper}>
          {!isLoading ? (
            <View style={style.loader}>
              <Bubbles size={10} style={style.loadBuble} color="#008b8b" />
            </View>
          ) : (
            <ScrollView>
              <View style={style.imageWrapper}>
                <Avatar
                  rounded
                  source={
                    photo === undefined
                      ? require('../assets/dummy.jpg')
                      : {uri: photo}
                  }
                  size={230}
                  avatarStyle={style.avartar}
                />
              </View>
              <View style={style.name}>
                <Text style={style.nameText}>
                  {name} <Icon1 name="primitive-dot" size={30} color="green" />
                </Text>
              </View>
              <Card style={style.card}>
                <View style={style.data1}>
                  <ListItem
                    title={status ? status : 'Available'}
                    subtitle="Status"
                    bottomDivider
                    leftIcon={{name: 'av-timer'}}
                  />
                  <ListItem
                    title={name}
                    subtitle="Display name"
                    bottomDivider
                    leftIcon={{name: 'account-box'}}
                  />
                  <ListItem
                    title={phone ? phone : 'Phone'}
                    subtitle="No Hp"
                    bottomDivider
                    leftIcon={{name: 'perm-phone-msg'}}
                  />
                </View>
              </Card>
            </ScrollView>
          )}
        </View>
      </>
    );
  }
}
const style = StyleSheet.create({
  imageWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('3%'),
  },
  image: {
    resizeMode: 'contain',
    height: hp('50%'),
    width: wp('100%'),
  },
  wrapper: {
    flex: 1,
    backgroundColor: '#e6e6fa',
  },
  title: {
    fontWeight: 'bold',
    fontSize: wp('8%'),
    marginLeft: -50,
  },
  header: {
    backgroundColor: '#008b8b',
  },
  name: {
    margin: wp('3%'),
    flexDirection: 'row',
  },
  nameText: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    color: 'black',
  },
  button: {
    width: wp('30%'),
    marginLeft: wp('30%'),
  },
  loader: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('40%'),
  },
  loadBuble: {
    marginTop: hp('50%'),
  },
  data1: {
    backgroundColor: 'blue',
    margin: wp('2%'),
  },
  card: {
    width: wp('90%'),
    alignSelf: 'center',
    borderRadius: wp('10%'),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 10,
  },
  avartar: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 1,
    shadowRadius: 2,
  },
});
