import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Header, Left, Body, Title, Form, Item, Label, Input} from 'native-base';
import firebase from '../config/config';
import {Bubbles} from 'react-native-loader';
export default class AddFriends extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      id: '',
      idSame: '',
      idFriend: '',
      photo: '',
      name: '',
      phone: '',
      status: '',
      email: '',
      emailUser: '',
      latitude: '',
      longitude: '',
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.send = this.send.bind(this);
  }
  send = (id, idFriend, userData) => {
    // const {name, photo, phone, status, email} = this.state;
    let friend;
    for (const key in userData) {
      friend = userData[key];
    }
    const db = firebase.database();
    db.ref('user/' + id + '/contacts').push({
      idFriend: idFriend,
      name: friend.name,
      photo: friend.photo || '',
      status: friend.status || '',
      email: friend.email,
      latitude: friend.latitude || null,
      longitude: friend.longitude || null,
    }) &&
      db.ref('user/' + idFriend + '/contacts').push({
        idFriend: id,
        name: this.state.name,
        photo: this.state.photo || '',
        status: this.state.status || '',
        phone: this.state.phone || '',
        email: this.state.emailUser,
        latitude: this.state.latitude,
        longitude: this.state.longitude,
      });
  };
  componentDidMount() {
    const id = firebase.auth().currentUser.uid;
    this.setState({id: id});
    firebase
      .database()
      .ref('user/' + id)
      .once('value')
      .then(data => {
        // data.val() is the dictionary with all your keys/values from the '/store' path
        const item = data.val();
        this.setState({
          name: item.name,
          photo: item.photo,
          status: item.status,
          phone: item.phone,
          latitude: item.latitude || -6.226407,
          longitude: item.longitude || 106.852069,
        });
      });
  }
  handleSearch = () => {
    const {email, id, idSame} = this.state;
    let rootRef = firebase.database().ref();
    rootRef
      .child('user')
      .orderByChild('email')
      .equalTo(email)
      .once('value')
      .then(snapshot => {
        if (snapshot.exists()) {
          let userData = snapshot.val();
          console.log(userData);

          let idFriend;
          for (const key in userData) {
            idFriend = key;
          }
          if (idFriend === id) {
            Alert.alert('You cant add yourself');
          }
          const db = firebase.database();
          db.ref('user/' + id)
            .child('contacts')
            .orderByChild('idFriend')
            .equalTo(idFriend)
            .once('value')
            .then(snapshot => {
              const data = snapshot.val();
              if (data === null) {
                this.send(id, idFriend, userData);
                Alert.alert(
                  'User found',
                  'This user will add to your contacts',
                  [
                    {
                      text: 'Cancel',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                    {
                      text: 'Ok',
                      onPress: () => {
                        this.props.navigation.push('Contacts');
                      },
                    },
                  ],
                  {cancelable: false},
                );
              }
              for (const key in data) {
                if (data[key].idFriend) {
                  Alert.alert(email + ' already exist in your contact');
                }
              }
            });
        } else {
          Alert.alert('email not found');
        }
      });
  };
  render() {
    const {isLoading} = this.state;
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
            <Title style={style.title}>Add Friends</Title>
          </Body>
        </Header>
        <View style={style.wrapper}>
          {!isLoading ? (
            <View style={style.loader}>
              <Bubbles size={10} style={style.loadBuble} color="#008b8b" />
            </View>
          ) : (
            <ScrollView>
              <Form style={style.flex}>
                <View style={style.form}>
                  <Item stackedLabel>
                    <Label style={style.label}>Enter your friend's email</Label>
                    <Input
                      type="text"
                      id="email"
                      name="email"
                      value={this.state.email}
                      onChangeText={value => {
                        this.setState({
                          email: value,
                        });
                      }}
                      style={style.input}
                    />
                  </Item>
                  <View style={style.buttonWrapper}>
                    <Button
                      onPress={this.handleSearch}
                      title="Search"
                      buttonStyle={style.button}
                    />
                  </View>
                </View>
              </Form>
            </ScrollView>
          )}
        </View>
      </>
    );
  }
}
const style = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#faf0e6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: wp('8%'),
    marginLeft: -60,
  },
  header: {
    backgroundColor: '#008b8b',
  },
  button: {
    width: wp('50%'),
    backgroundColor: '#008b8b',
    borderRadius:10,
    marginLeft:-50,
    marginRight:100,
  },
  form: {
    marginTop: hp('3%'),
    height: hp('50%'),
  },
  buttonWrapper: {
    justifyContent: 'center',
    marginTop: wp('3%'),
    alignItems: 'center',
  },
  loader: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('40%'),
  },
  loadBuble: {marginTop: hp('50%')},
  flex: {height: hp('80%'), justifyContent: 'center', alignItems: 'center'},
  input: {
    // borderWidth: wp('0.2%'),
    borderColor: 'black',
    borderRadius: wp('50%'),
    padding: wp('2%'),
  },
  label: {
    marginTop: hp('-1%'),
    marginBottom: hp('0.8%'),
  },
});
